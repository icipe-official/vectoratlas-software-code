// MapWrapperV3.tsx - Patched with normalized species filter + restored legend + collapsible HUD

import React, { useEffect, useRef, useState } from 'react';
import OlMap from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import Box from '@mui/material/Box';
import { Typography, IconButton } from '@mui/material';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import 'ol/ol.css';

import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';

import {
  setSelectedIds,
  showLayerVisible,
  updateProcessedPoints,
  filterHandler,
} from '../../../state/map/mapSlice';

import { getOccurrenceData } from '../../../state/map/actions/getOccurrenceData';
import { getFullOccurrenceData } from '../../../state/map/actions/getFullOccurrenceData';

import {
  buildBaseMapLayer,
  updateBaseMapStyles,
  updateOverlayLayers,
} from './layerUtils';

import {
  buildPointLayerWebGL,
  cssColorToVec4,
  getSpeciesStyles,
  updateSelectionAttributesWebGL,
  updateLegendForSpeciesWebGL,
} from './pointutilswebgl';

import { speciesStyle } from './types';
import { responseToGEOJSON } from '../utils/map.utils';

import DrawerMap from '../layers/drawerMap';
import DataDrawer from '../layers/dataDrawer';
import ScaleLegend from './scaleLegend';
// Material UI Core Components
import { CircularProgress } from '@mui/material';

// Material UI Icons

type MapWrapperV3Props = {
  doiResolverId?: string;
};

const MapWrapperV3: React.FC<MapWrapperV3Props> = ({ doiResolverId }) => {
  const dispatch = useAppDispatch();
  const t = useTranslations('MapPage');

  /* ---------------- Redux selectors ---------------- */
  const occurrenceData = useAppSelector((s) => s.map.occurrence_data);
  const filters = useAppSelector((s) => s.map.filters);
  const drawerOpen = useAppSelector((s) => s.map.map_drawer.open);
  const selectedIds = useAppSelector((s) => s.map.selectedIds);
  const mapStyles = useAppSelector((s) => s.map.map_styles);
  const mapOverlays = useAppSelector((s) => s.map.map_overlays);
  const fullSpeciesList = useAppSelector((s) => s.map.filterValues.species);
  const areaModeOn = useAppSelector((s) => s.map.areaSelectModeOn);
  const occurrenceLoading = useAppSelector(
    (s) => s.map.occurrenceLoading ?? false
  );

  /* ---------------- derive unique scales ---------------- */
  const overlaysActive = mapOverlays.filter(
    (l) => l.sourceLayer === 'overlays' && l.isVisible === true
  );

  const uniqueScales = overlaysActive
    .map((o) => o.scale as string)
    .filter((s, i, self) => self.indexOf(s) === i);

  /* ---------------- map state ---------------- */
  const [map, setMap] = useState<OlMap | null>(null);
  const [speciesStyles, setSpeciesStyles] = useState<speciesStyle[]>([]);
  const mapElement = useRef<HTMLDivElement | null>(null);
  const pointLayerRef = useRef<WebGLPointsLayer<VectorSource<Point>> | null>(
    null
  );

  /* ---------------- HUD state ---------------- */
  const [visiblePointCount, setVisiblePointCount] = useState(0);
  const [speciesCounts, setSpeciesCounts] = useState<Record<string, number>>(
    {}
  );
  const [panelOpen, setPanelOpen] = useState(true);

  /* ---------------- NORMALIZED SPECIES FILTER ---------------- */
  const normalize = (s: string) => s.trim().toLowerCase();

  /* ---------------- fetch data ---------------- */
  useEffect(() => {
    dispatch(getOccurrenceData(filters));
  }, [filters, dispatch]);

  /* ---------------- init map ONCE ---------------- */
  useEffect(() => {
    if (!mapElement.current || map) return;

    dispatch(updateProcessedPoints([]));

    const baseLayer = buildBaseMapLayer();
    const styles = getSpeciesStyles(fullSpeciesList);
    setSpeciesStyles(styles);

    const pointLayer = buildPointLayerWebGL([], styles);
    pointLayerRef.current = pointLayer;

    const olMap = new OlMap({
      target: mapElement.current,
      layers: [baseLayer, pointLayer],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
    });

    setMap(olMap);

    return () => {
      olMap.setTarget(undefined);
      olMap.dispose();
    };
  }, []); // eslint-disable-line

  /* ---------------- Update species styles ---------------- */
  useEffect(() => {
    if (!fullSpeciesList.length) return;
    setSpeciesStyles(getSpeciesStyles(fullSpeciesList));
  }, [fullSpeciesList]);

  /* ---------------- Update points (NO MAP RECREATION) ---------------- */
  useEffect(() => {
    if (!pointLayerRef.current || !speciesStyles.length) return;

    const source = pointLayerRef.current.getSource();
    if (!source) return;

    source.clear();
    if (occurrenceData.length === 0) return;

    const speciesFilter =
      Array.isArray(filters.species) && filters.species.length > 0
        ? filters.species
        : fullSpeciesList;

    const filteredData = occurrenceData.filter((o) =>
      speciesFilter.some((fsp) => normalize(fsp) === normalize(o.species))
    );

    const features = new GeoJSON().readFeatures(
      responseToGEOJSON(filteredData),
      { featureProjection: 'EPSG:3857' }
    ) as Feature<Point>[];

    const speciesColorMap = new Map<string, [number, number, number, number]>();
    speciesStyles.forEach((s) => {
      speciesColorMap.set(normalize(s.species), cssColorToVec4(s.color));
    });

    features.forEach((f) => {
      const species = normalize(String(f.get('species') ?? ''));
      const [r, g, b, a] =
        speciesColorMap.get(species) ?? cssColorToVec4('#038543');

      f.set('r', r);
      f.set('g', g);
      f.set('b', b);
      f.set('a', a);
      f.set('baseSize', 9);
      f.set('selected', 0);

      if (!f.get('id') && f.getId()) {
        f.set('id', f.getId());
      }
    });

    source.addFeatures(features);
  }, [occurrenceData, speciesStyles, filters.species, fullSpeciesList]);

  /* ---------------- Viewport-aware HUD counts (RAF throttled) ---------------- */
  useEffect(() => {
    if (!map || !pointLayerRef.current) return;

    const source = pointLayerRef.current.getSource();
    if (!source) return;

    let rafId: number | null = null;

    const updateStats = () => {
      rafId = null;
      const extent = map.getView().calculateExtent(map.getSize());
      const visible = source.getFeaturesInExtent(extent);

      setVisiblePointCount(visible.length);

      const counts: Record<string, number> = {};
      for (const f of visible) {
        const sp = normalize(f.get('species') ?? 'unknown');
        counts[sp] = (counts[sp] ?? 0) + 1;
      }

      setSpeciesCounts(counts);
    };

    const throttled = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateStats);
      }
    };

    map.on('moveend', throttled);
    throttled();

    return () => {
      map.un('moveend', throttled);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [map, occurrenceData]);

  /* ---------------- RESTORED: Update legend based on visible species ---------------- */
  useEffect(() => {
    if (!map || !speciesStyles.length) return;

    const source = pointLayerRef.current?.getSource();
    if (!source) return;

    const visibleSpeciesSet = new Set<string>();
    source.getFeatures().forEach((f) => {
      const species = f.get('species');
      if (species) visibleSpeciesSet.add(species);
    });

    const visibleSpecies = Array.from(visibleSpeciesSet);

    updateLegendForSpeciesWebGL(
      visibleSpecies,
      speciesStyles,
      selectedIds,
      map
    );
  }, [
    map,
    speciesStyles,
    filters.species,
    fullSpeciesList,
    selectedIds,
    occurrenceData,
  ]);

  /* ---------------- Update selection highlighting ---------------- */
  useEffect(() => {
    if (!pointLayerRef.current) return;
    const source = pointLayerRef.current.getSource();
    if (!source) return;

    updateSelectionAttributesWebGL(source, selectedIds);
  }, [selectedIds]);

  /* ---------------- update overlays & basemap ---------------- */
  useEffect(() => {
    if (!map) return;

    updateBaseMapStyles(mapStyles, mapOverlays, map);
    updateOverlayLayers(mapStyles, mapOverlays, map);
  }, [map, mapStyles, mapOverlays]);

  /* ---------------- click handler ---------------- */
  useEffect(() => {
    if (!map) return;

    const handleClick = (evt: any) => {
      const ids: string[] = [];
      map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
        if (layer?.get('occurrence-data') || feat.get('id')) {
          ids.push(feat.get('id'));
        }
      });

      if (ids.length) {
        dispatch(setSelectedIds(ids));
        dispatch(getFullOccurrenceData());
      }
    };

    map.on('singleclick', handleClick);
    return () => map.un('singleclick', handleClick);
  }, [map, dispatch]);

  /* ---------------- resize on drawer ---------------- */
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => map.updateSize(), 250);
    return () => clearTimeout(timer);
  }, [drawerOpen, map]);

  /* ---------------- DOI filters ---------------- */
  useEffect(() => {
    if (!doiResolverId) return;

    const fetchAndApply = async () => {
      try {
        const res = await fetch(`/vector-api/doi/resolver/${doiResolverId}`);
        const data = await res.json();

        const fetchedFilters = data?.meta_data?.filters;
        if (fetchedFilters) {
          Object.entries(fetchedFilters).forEach(([filterName, filter]) => {
            dispatch(
              filterHandler({
                filterName,
                filterOptions: filter,
              })
            );
          });
        }

        if (data?.uploaded_model) {
          const name = data.uploaded_model.title.trim().replace(/\s/g, '_');
          dispatch(showLayerVisible(name));
        }
      } catch (e) {
        console.error('DOI resolver error', e);
      }
    };

    fetchAndApply();
  }, [doiResolverId, dispatch]);

  /* ---------------- render ---------------- */
  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <DrawerMap />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <div
          id="mapDiv"
          ref={mapElement}
          style={{ height: 'calc(100vh - 150px)' }}
        />
      </Box>
      {selectedIds.length > 0 && <DataDrawer />}
      {/* ---------------- Collapsible Glass HUD (Top Right) ---------------- */}
      <div
        style={{
          position: 'absolute',
          // DYNAMIC POSITIONING: If a point is selected (DataDrawer open),
          // we shift the HUD left by 412px (approx drawer width + gap).
          right: selectedIds.length > 0 ? 412 : 12,
          top: 120,
          width: panelOpen ? 280 : 180,
          padding: panelOpen ? 14 : 10,
          borderRadius: 18,
          backdropFilter: 'blur(18px)',
          background: 'rgba(20,20,20,0.65)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          color: 'white',
          // TRANSITION: Ensures the HUD slides smoothly when the drawer appears
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 20,
          overflow: 'hidden',
        }}
      >
        {/* HEADER: Title and Toggle */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            fontWeight={700}
            fontSize={14}
            sx={{
              opacity: occurrenceLoading ? 0.6 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            Records in View
          </Typography>

          <IconButton
            onClick={() => setPanelOpen((v) => !v)}
            size="small"
            sx={{
              color: 'white',
              transform: panelOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ExpandLessIcon />
          </IconButton>
        </Box>

        {/* PRIMARY STATS: Always Visible */}
        <Box mt={1} display="flex" flexDirection="column" gap={0.5}>
          {/* AVAILABLE COUNT with Loader Replacement */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontSize={13}
              sx={{
                opacity: occurrenceLoading ? 0.4 : 0.7,
                transition: 'all 0.3s',
                color:
                  !occurrenceLoading && visiblePointCount === 0
                    ? '#EBBD40'
                    : 'white',
              }}
            >
              Available:
            </Typography>

            <Box
              minWidth={24}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              {occurrenceLoading ? (
                <CircularProgress
                  size={16}
                  thickness={6}
                  disableShrink
                  sx={{ color: '#EBBD40' }}
                />
              ) : (
                <Typography
                  fontSize={13}
                  fontWeight={700}
                  sx={{ opacity: visiblePointCount === 0 ? 0.5 : 1 }}
                >
                  {visiblePointCount}
                </Typography>
              )}
            </Box>
          </Box>

          {/* SELECTED COUNT */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize={13} sx={{ opacity: 0.7 }}>
              Selected:
            </Typography>
            <Typography fontSize={13} fontWeight={700}>
              {selectedIds.length}
            </Typography>
          </Box>
        </Box>

        {/* DETAILED BREAKDOWN: Collapsible */}
        {panelOpen && (
          <Box
            mt={2}
            pt={1.5}
            sx={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              animation: 'fadeInHUD 0.4s ease-out',
              '@keyframes fadeInHUD': {
                '0%': { opacity: 0, transform: 'translateY(-10px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Typography
              fontWeight={700}
              fontSize={11}
              mb={1.5}
              sx={{
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Species Breakdown
            </Typography>

            <Box
              maxHeight={160}
              overflow="auto"
              sx={{
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                },
              }}
            >
              {Object.entries(speciesCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([sp, count]) => {
                  const style = speciesStyles.find(
                    (s) => normalize(s.species) === normalize(sp)
                  );

                  return (
                    <Box
                      key={sp}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: style?.color ?? '#ccc',
                            boxShadow: style?.color
                              ? `0 0 6px ${style.color}`
                              : 'none',
                          }}
                        />
                        <Typography fontSize={12} sx={{ opacity: 0.85 }}>
                          {sp}
                        </Typography>
                      </Box>
                      <Typography fontSize={12} fontWeight={600}>
                        {count}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        )}
      </div>{' '}
      {/* ---------------- Area mode banner ---------------- */}
      {areaModeOn && (
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: 100,
            zIndex: 10,
            background: '#EBBD40',
            boxShadow: '0 0 10px black',
            padding: '5px 20px',
            color: 'black',
          }}
        >
          <Typography>{t('areaModeOn')}</Typography>
        </div>
      )}
      {/* ---------------- ORIGINAL SCALE LEGEND (UNCHANGED) ---------------- */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          right: 10,
          top: 260,
          zIndex: 10,
          height: 200,
          color: 'black',
        }}
      >
        {uniqueScales.map((s) => {
          const scale = mapStyles.scales.find((sc) => sc.name === s);
          return <ScaleLegend key={s} overlayName={s} title={scale?.title} />;
        })}
      </div>
    </Box>
  );
};

export default MapWrapperV3;
