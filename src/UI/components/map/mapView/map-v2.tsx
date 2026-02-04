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
import { useMemo } from 'react';
const normalize = (s: string) => s.trim().toLowerCase();

const MapWrapperV3: React.FC<MapWrapperV3Props> = ({ doiResolverId }) => {
  const [hoveredSpecies, setHoveredSpecies] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const t = useTranslations('MapPage');
  // This tells TS the object will hold HTMLDivElements indexed by strings
  const speciesRowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
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
  const [animatedVisibleCount, setAnimatedVisibleCount] = useState(0);
  const hoverLayerRef = useRef<WebGLPointsLayer<VectorSource<Point>> | null>(null);
  // useEffect(() => {
  //   const layer = pointLayerRef.current;
  //   if (!layer) return;
  //   const source = layer.getSource();
  //   if (!source) return;
  //
  //   const features = source.getFeatures();
  //
  //   // 1. Mark the attributes
  //   features.forEach((f) => {
  //     const isMatch = normalize(f.get('species') ?? '') === hoveredSpecies;
  //
  //     // We keep size at exactly 9 and alpha at 1.0
  //     f.set('baseSize', 9);
  //     f.set('a', 1.0);
  //
  //     if (hoveredSpecies && isMatch) {
  //       f.set('selected', 1); // Triggers the border if the style supports it
  //     } else {
  //       f.set('selected', 0);
  //     }
  //   });
  //
  //   // 2. THE PHYSICAL Z-INDEX FIX
  //   // We sort the features so the matched species are at the very END of the array.
  //   // In WebGL, the end of the array is painted LAST (on top of the start).
  //   const sortedFeatures = [...features].sort((a, b) => {
  //     const aMatch = hoveredSpecies === normalize(a.get('species') ?? '');
  //     const bMatch = hoveredSpecies === normalize(b.get('species') ?? '');
  //     if (aMatch && !bMatch) return 1;  // Move highlight to end
  //     if (!aMatch && bMatch) return -1; // Keep background at start
  //     return 0;
  //   });
  //
  //   // 3. THE RE-BUFFER
  //   // We clear and re-add to force the GPU to rebuild the draw order.
  //   source.clear(true);
  //   source.addFeatures(sortedFeatures);
  //   layer.changed();
  //
  // }, [hoveredSpecies]);

  // Smoothly interpolate the total count
  useEffect(() => {
    let start = animatedVisibleCount;
    const end = visiblePointCount;
    if (start === end) return;

    const duration = 600; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quadratic
      const ease = 1 - (1 - progress) * (1 - progress);
      const nextValue = Math.floor(start + (end - start) * ease);

      setAnimatedVisibleCount(nextValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [visiblePointCount]);

  /* ---------------- Derivations ---------------- */
  const activeSpecies = useMemo(() => {
    if (!selectedIds || selectedIds.length === 0) return null;

    // Convert both to strings during the find to ensure a match
    const match = occurrenceData.find((o) =>
      selectedIds.map(String).includes(String(o.id))
    );

    // Ensure match and match.species exist before normalizing
    return (match && match.species) ? normalize(match.species) : null;
  }, [selectedIds, occurrenceData]);

  // 2. Trigger Scroll
  useEffect(() => {
    if (activeSpecies && speciesRowRefs.current[activeSpecies]) {
      // Ensure panel is open to allow scrolling
      setPanelOpen(true);

      // Delay slightly to ensure DOM is rendered if panel was just opened
      setTimeout(() => {
        speciesRowRefs.current[activeSpecies]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 150);
    }
  }, [activeSpecies]);
  /* ---------------- NORMALIZED SPECIES FILTER ---------------- */

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
          right: selectedIds.length > 0 ? 412 : 12,
          top: 120,
          width: panelOpen ? 280 : 180,
          padding: panelOpen ? 14 : 10,
          borderRadius: 18,
          backdropFilter: 'blur(18px)',
          background: 'rgba(24,24,24,0.55)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 6px 22px rgba(0,0,0,0.35)',
          color: 'white',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 20,
          overflow: 'hidden',
        }}
      >
        {/* LOADING SHIMMER OVERLAY */}
        {occurrenceLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              animation: 'shimmer 1.6s infinite linear',
              backgroundSize: '200% 100%',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={3}>
          <Typography fontWeight={700} fontSize={14} sx={{ opacity: occurrenceLoading ? 0.55 : 0.85 }}>
            Records in View
          </Typography>
          <IconButton
            onClick={() => setPanelOpen((v) => !v)}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              transform: panelOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ExpandLessIcon />
          </IconButton>
        </Box>

        {/* PRIMARY STATS: IDENTIFICATION LOGIC */}
        <Box mt={1.5} display="flex" alignItems="center" gap={2} position="relative" zIndex={3}>


          <Box display="flex" flexDirection="column">
            <Typography fontSize={10} sx={{ opacity: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>
              Available
            </Typography>
            <Typography
              fontSize={18}
              fontWeight={900}
              sx={{
                color: '#7EEFA8',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              {animatedVisibleCount.toLocaleString()}
            </Typography>

          </Box>
        </Box>
        {/* DETAILED BREAKDOWN */}
        {panelOpen && (
          <Box mt={2} pt={1.5} position="relative" zIndex={3}>
            <Typography
              fontWeight={700}
              fontSize={11}
              mb={1.5}
              sx={{ opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.9px' }}
            >
              Species Breakdown
            </Typography>

            <Box
              maxHeight={160}
              overflow="auto"
              sx={{
                px: 0.5,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '10px' },
              }}
            >
              {Object.entries(speciesCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([sp, count]) => {
                  const normalizedSp = normalize(sp);
                  const isSelected = activeSpecies === normalizedSp;
                  // CHECK HOVER: Ensure you have a 'hoveredSpecies' state in your parent
                  const isHovered = hoveredSpecies === normalizedSp;

                  const style = speciesStyles.find((s) => normalize(s.species) === normalizedSp);

                  return (
                    <Box
                      key={sp}
                      ref={(el: HTMLDivElement | null) => {
                        if (el) {
                          speciesRowRefs.current[normalize(sp)] = el;
                        }
                      }}
                      // TRIGGER STATE CHANGES HERE
                      onMouseEnter={() => setHoveredSpecies(normalize(sp))}
                      onMouseLeave={() => setHoveredSpecies(null)}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0.75}
                      p="6px 8px"
                      sx={{
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: isSelected || isHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
                        borderLeft: isSelected ? `3px solid ${style?.color || '#fff'}` : '3px solid transparent',
                        transform: isHovered ? 'translateX(4px)' : 'none',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.4}>
                        {/* LEGEND DOT - Now with Bright Border and Glow */}
                        <div
                          style={{
                            width: isHovered ? 11 : 8,
                            height: isHovered ? 11 : 8,
                            borderRadius: '50%',
                            background: style?.color ?? '#bbb',
                            // THE "BRIGHT BORDER" & GLOW
                            border: `1.5px solid ${isHovered ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                            boxShadow: isHovered
                              ? `0 0 15px ${style?.color}, 0 0 5px #fff`
                              : isSelected
                                ? `0 0 10px ${style?.color}`
                                : 'none',
                            transition: 'all 0.25s ease-out',
                          }}
                        />

                        <Typography fontSize={12} sx={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ opacity: 0.35, fontWeight: 400 }}>An.</span>
                          <span
                            style={{
                              fontStyle: 'italic',
                              fontWeight: (isSelected || isHovered) ? 700 : 500,
                              opacity: (isSelected || isHovered) ? 1 : 0.8,
                              color: (isSelected || isHovered) ? style?.color : 'rgba(255,255,255,0.95)',
                              textTransform: 'lowercase',
                            }}
                          >
                            {sp}
                          </span>
                        </Typography>
                      </Box>

                      <Typography
                        fontSize={12}
                        fontWeight={700}
                        sx={{
                          fontVariantNumeric: 'tabular-nums',
                          opacity: isHovered ? 1 : 0.7,
                          color: isHovered ? style?.color : 'inherit',
                          transition: 'color 0.2s'
                        }}
                      >
                        {count}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        )}

        {/* FIXED CSS ERROR: Wrapped in dangerouslySetInnerHTML */}
        <style dangerouslySetInnerHTML={{
          __html: `
    @keyframes pulseHighlight {
      0% { background: rgba(255,255,255,0.05); }
      50% { background: rgba(255,255,255,0.15); }
      100% { background: rgba(255,255,255,0.05); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `}} />
      </div>    {/* ---------------- Area mode banner ---------------- */}
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
