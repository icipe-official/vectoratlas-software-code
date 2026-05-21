import React, { useEffect, useRef, useState, useMemo } from 'react';

import OlMap from 'ol/Map';

import View from 'ol/View';

import { transform } from 'ol/proj';

import Box from '@mui/material/Box';

import { Typography } from '@mui/material';

import WebGLPointsLayer from 'ol/layer/WebGLPoints';

import VectorSource from 'ol/source/Vector';

import Feature from 'ol/Feature';

import Point from 'ol/geom/Point';

import GeoJSON from 'ol/format/GeoJSON';
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
  updateWMTSLayers,
} from './layerUtils';

import {
  buildPointLayerWebGL,
  buildAbsenceLayerWebGL,
  cssColorToVec4,
  getSpeciesStyles,
  updateSelectionAttributesWebGL,
  setCommonFeatureAttrs,
} from './pointutilswebgl';

import { speciesStyle } from './types';

import { responseToGEOJSON } from '../utils/map.utils';

import DrawerMap from '../layers/drawerMap';

import DataDrawer from '../layers/dataDrawer';

import MapHUD from './MapHUD';
import MapLoader from './maploader';
import { OverlayPanel } from '../layers/OverlayPanel';
type MapWrapperV3Props = {
  doiResolverId?: string;
};

const normalize = (s: string) => s.trim().toLowerCase();

const getPresenceStatus = (
  value: unknown
): 'presence' | 'absence' | 'unknown' => {
  const v = String(value ?? '')
    .toLowerCase()

    .trim();

  if (v === '1' || v === 'true' || v === 'presence' || v === 'present') {
    return 'presence';
  }

  if (v === '0' || v === 'false' || v === 'absence' || v === 'absent') {
    return 'absence';
  }

  return 'unknown';
};

const MapWrapperV3: React.FC<MapWrapperV3Props> = ({ doiResolverId }) => {
  const [hoveredSpecies, setHoveredSpecies] = useState<string | null>(null);

  const [showDetected, setShowDetected] = useState(true);

  const [showNotDetected, setShowNotDetected] = useState(false);

  const dispatch = useAppDispatch();

  const t = useTranslations('MapPage');

  const speciesRowRefs = React.useRef<Record<string, HTMLDivElement | null>>(
    {}
  );

  /* ---------------- Redux selectors ---------------- */

  const occurrenceData = useAppSelector((s) => s.map.occurrence_data);

  const filters = useAppSelector((s) => s.map.filters);

  const drawerOpen = useAppSelector((s) => s.map.map_drawer.open);

  const selectedIds = useAppSelector((s) => s.map.selectedIds);

  const mapStyles = useAppSelector((s) => s.map.map_styles);

  const mapOverlays = useAppSelector((s) => s.map.map_overlays);

  const fullSpeciesList = useAppSelector((s) => s.map.filterValues.species);

  const wmtsLayers = useAppSelector((s) => s.map.wmtsLayers);

  const areaModeOn = useAppSelector((s) => s.map.areaSelectModeOn);

  const masterData = useAppSelector((s) => s.map.master_occurrence_data);
  const featuresInitialized = useRef(false);

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

  const absenceLayerRef = useRef<WebGLPointsLayer<VectorSource<Point>> | null>(
    null
  );

  const hoverPresenceLayerRef = useRef<WebGLPointsLayer<
    VectorSource<Point>
  > | null>(null);

  const hoverAbsenceLayerRef = useRef<WebGLPointsLayer<
    VectorSource<Point>
  > | null>(null);

  /* ---------------- HUD state ---------------- */

  const [visiblePointCount, setVisiblePointCount] = useState(0);

  const [speciesCounts, setSpeciesCounts] = useState<Record<string, number>>(
    {}
  );

  const [panelOpen, setPanelOpen] = useState(true);

  const [animatedVisibleCount, setAnimatedVisibleCount] = useState(0);

  /* ---------------- Smooth counter ---------------- */

  useEffect(() => {
    let start = animatedVisibleCount;

    const end = visiblePointCount;

    if (start === end) return;

    const duration = 600;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

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

    const match = occurrenceData.find((o) =>
      selectedIds.map(String).includes(String(o.id))
    );

    return match && match.species ? normalize(match.species) : null;
  }, [selectedIds, occurrenceData]);

  useEffect(() => {
    if (activeSpecies && speciesRowRefs.current[activeSpecies]) {
      setPanelOpen(true);

      setTimeout(() => {
        speciesRowRefs.current[activeSpecies]?.scrollIntoView({
          behavior: 'smooth',

          block: 'nearest',
        });
      }, 150);
    }
  }, [activeSpecies]);

  /* ---------------- fetch data ---------------- */

  useEffect(() => {
    dispatch(getOccurrenceData());
  }, []);

  useEffect(() => {
    if (!masterData.length || featuresInitialized.current) return;

    const presenceSource = pointLayerRef.current?.getSource();
    const absenceSource = absenceLayerRef.current?.getSource();

    const allFeatures = new GeoJSON().readFeatures(
      responseToGEOJSON(masterData),
      {
        featureProjection: 'EPSG:3857',
      }
    ) as Feature<Point>[];

    const speciesColorMap = new Map<string, [number, number, number, number]>();
    speciesStyles.forEach((s) => {
      speciesColorMap.set(normalize(s.species), cssColorToVec4(s.color));
    });

    // 2. Distribute features and apply ALL attributes
    allFeatures.forEach((f) => {
      // CRITICAL: This sets r, g, b, a, baseSize, and gpuVisible=1
      setCommonFeatureAttrs(f, speciesColorMap);

      if (getPresenceStatus(f.get('binary_presence')) === 'absence') {
        absenceSource?.addFeature(f);
      } else {
        presenceSource?.addFeature(f);
      }
    });

    featuresInitialized.current = true;
  }, [masterData, speciesStyles]);

  useEffect(() => {
    console.log('Occurrence Data:', occurrenceData);

    if (occurrenceData.length > 0) {
      console.log('First occurrence item:', occurrenceData[0]);
    }
  }, [occurrenceData]);

  useEffect(() => {
    console.log('===== FILTER DEBUG =====');

    console.log('Redux Filters:', filters);

    console.log('Occurrence Count:', occurrenceData.length);

    if (occurrenceData.length > 0) {
      console.log('First Occurrence:', occurrenceData[0]);
    }

    const presenceSource = pointLayerRef.current?.getSource();

    if (presenceSource) {
      const features = presenceSource.getFeatures();

      console.log('GPU Feature Count:', features.length);

      if (features.length > 0) {
        console.log('GPU Feature Properties:', features[0].getProperties());
      }
    }
  }, [filters, occurrenceData]);

  useEffect(() => {
    const presenceSource = pointLayerRef.current?.getSource();
    const absenceSource = absenceLayerRef.current?.getSource();
    if (!presenceSource || !absenceSource) return;

    const selectedSpecies = filters.species?.value ?? [];
    const selectedCountries = filters.country?.value ?? [];

    const runGpuFilter = (source: VectorSource<Point>) => {
      const features = source.getFeatures();
      if (features.length > 0) {
        console.log('Debug - Feature Data Sample:', {
          species: features[0].get('species'),
          country: features[0].get('country'), // If this is undefined, the filter won't work
          year: features[0].get('year'),
          isAdult: features[0].get('is_adult'),
        });
      }

      const {
        species,
        country,
        binary_presence,
        isAdult,
        isLarval,
        bionomics,
        timeRange,
        season,
      } = filters;
      for (let i = 0; i < features.length; i++) {
        const f = features[i];
        let visible = 1;

        // Check Species
        if (
          selectedSpecies.length > 0 &&
          !selectedSpecies.includes(f.get('species'))
        ) {
          visible = 0;
        }
        // 2. Country Filter
        if (
          visible &&
          country.value.length > 0 &&
          !country.value.includes(f.get('country'))
        )
          visible = 0;

        // 3. Binary Presence (True = Abundance/Presence, False = Absence)
        if (visible && binary_presence.value.length > 0) {
          const status = getPresenceStatus(f.get('binary_presence'));
          if (status === 'absence' && !binary_presence.value.includes('False'))
            visible = 0;
          if (status === 'presence' && !binary_presence.value.includes('True'))
            visible = 0;
        }

        // 4. Life Stage Filters (Boolean checks)
        if (visible && isAdult.value.includes(true) && f.get('is_adult') !== 1)
          visible = 0;
        if (
          visible &&
          isLarval.value.includes(true) &&
          f.get('is_larval') !== 1
        )
          visible = 0;

        // 5. General Bionomics Filter
        if (
          visible &&
          bionomics.value.includes(true) &&
          f.get('has_bionomics') !== 1
        )
          visible = 0;

        // 6. Time Range Filter
        const year = f.get('year');
        if (visible && timeRange.value.start && year < timeRange.value.start)
          visible = 0;
        if (visible && timeRange.value.end && year > timeRange.value.end)
          visible = 0;

        // 7. Season Filter
        if (
          visible &&
          season.value.length > 0 &&
          !season.value.includes(f.get('season_val'))
        )
          visible = 0;

        // Update attribute (GPU picks this up instantly)
        if (f.get('gpuVisible') !== visible) {
          f.set('gpuVisible', visible);
        }
      }
      source.changed(); // Trigger Redraw
    };

    runGpuFilter(presenceSource);
    runGpuFilter(absenceSource);
  }, [filters]); // Watch filter changes, NOT data changes

  /* ---------------- init map ONCE ---------------- */

  useEffect(() => {
    if (!mapElement.current || map) return;

    dispatch(updateProcessedPoints([]));

    const baseLayer = buildBaseMapLayer();

    const styles = getSpeciesStyles(fullSpeciesList);

    setSpeciesStyles(styles);

    const presenceLayer = buildPointLayerWebGL([], styles);

    const absenceLayer = buildAbsenceLayerWebGL([], styles);

    const hoverPresenceLayer = buildPointLayerWebGL([], styles);

    const hoverAbsenceLayer = buildAbsenceLayerWebGL([], styles);

    hoverPresenceLayer.set('hover-layer', true);

    hoverAbsenceLayer.set('hover-layer', true);

    hoverPresenceLayer.setZIndex(110);

    hoverAbsenceLayer.setZIndex(111);

    presenceLayer.setZIndex(100);

    absenceLayer.setZIndex(101);

    pointLayerRef.current = presenceLayer;

    absenceLayerRef.current = absenceLayer;

    hoverPresenceLayerRef.current = hoverPresenceLayer;

    hoverAbsenceLayerRef.current = hoverAbsenceLayer;

    const olMap = new OlMap({
      target: mapElement.current,

      layers: [
        baseLayer,

        presenceLayer,

        absenceLayer,

        hoverPresenceLayer,

        hoverAbsenceLayer,
      ],

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







  /* ---------------- layer visibility toggles ---------------- */

  useEffect(() => {
    pointLayerRef.current?.setVisible(showDetected);

    hoverPresenceLayerRef.current?.setVisible(showDetected);
  }, [showDetected]);

  useEffect(() => {
    absenceLayerRef.current?.setVisible(showNotDetected);

    hoverAbsenceLayerRef.current?.setVisible(showNotDetected);
  }, [showNotDetected]);

  /* ---------------- Update species styles ---------------- */

  useEffect(() => {
    if (!fullSpeciesList.length) return;

    setSpeciesStyles(getSpeciesStyles(fullSpeciesList));
  }, [fullSpeciesList]);

  /* ---------------- Update points in both layers ---------------- */

  // useEffect(() => {
  //   if (
  //     !pointLayerRef.current ||
  //     !absenceLayerRef.current ||
  //     !hoverPresenceLayerRef.current ||
  //     !hoverAbsenceLayerRef.current ||
  //     !speciesStyles.length
  //   )
  //     return;

  //   const presenceSource = pointLayerRef.current.getSource();

  //   const absenceSource = absenceLayerRef.current.getSource();

  //   const hoverPresenceSource = hoverPresenceLayerRef.current.getSource();

  //   const hoverAbsenceSource = hoverAbsenceLayerRef.current.getSource();

  //   if (
  //     !presenceSource ||
  //     !absenceSource ||
  //     !hoverPresenceSource ||
  //     !hoverAbsenceSource
  //   )
  //     return;

  //   presenceSource.clear();

  //   absenceSource.clear();

  //   hoverPresenceSource.clear();

  //   hoverAbsenceSource.clear();

  //   if (occurrenceData.length === 0) return;

  //   const selectedSpecies = filters.species?.value ?? [];

  //   const speciesFilter =
  //     Array.isArray(selectedSpecies) && selectedSpecies.length > 0
  //       ? selectedSpecies
  //       : fullSpeciesList;

  //   const filteredData = occurrenceData.filter((o) =>
  //     speciesFilter.some(
  //       (fsp) => normalize(String(fsp)) === normalize(String(o.species))
  //     )
  //   );

  //   const features = new GeoJSON().readFeatures(
  //     responseToGEOJSON(filteredData),

  //     { featureProjection: 'EPSG:3857' }
  //   ) as Feature<Point>[];

  //   const speciesColorMap = new Map<string, [number, number, number, number]>();

  //   speciesStyles.forEach((s) => {
  //     speciesColorMap.set(normalize(s.species), cssColorToVec4(s.color));
  //   });

  //   const presenceFeatures: Feature<Point>[] = [];

  //   const absenceFeatures: Feature<Point>[] = [];

  //   features.forEach((f) => {
  //     const species = normalize(String(f.get('species') ?? ''));

  //     const [r, g, b, a] =
  //       speciesColorMap.get(species) ?? cssColorToVec4('#038543');

  //     const presenceStatus = getPresenceStatus(f.get('binary_presence'));

  //     f.set('r', r);

  //     f.set('g', g);

  //     f.set('b', b);

  //     f.set('a', a);

  //     f.set('selected', 0);

  //     f.set('highlight', 0);

  //     f.set('presenceStatus', presenceStatus);

  //     f.set('isPresence', presenceStatus === 'presence' ? 1 : 0);

  //     f.set('isAbsence', presenceStatus === 'absence' ? 1 : 0);

  //     if (!f.get('id') && f.getId()) {
  //       f.set('id', f.getId());
  //     }

  //     if (presenceStatus === 'absence') {
  //       f.set('baseSize', 12);

  //       absenceFeatures.push(f);
  //     } else {
  //       f.set('baseSize', 9);

  //       presenceFeatures.push(f);
  //     }
  //   });

  //   presenceSource.addFeatures(presenceFeatures);

  //   absenceSource.addFeatures(absenceFeatures);
  // }, [occurrenceData, speciesStyles, filters.species, fullSpeciesList]);

  /* ---------------- Viewport-aware HUD counts from both layers ---------------- */

  useEffect(() => {
    if (!map || !pointLayerRef.current || !absenceLayerRef.current) return;

    const presenceSource = pointLayerRef.current.getSource();

    const absenceSource = absenceLayerRef.current.getSource();

    if (!presenceSource || !absenceSource) return;

    let rafId: number | null = null;

    const updateStats = () => {
      rafId = null;

      const extent = map.getView().calculateExtent(map.getSize());
      const visible = [
        ...presenceSource.getFeaturesInExtent(extent),
        ...absenceSource.getFeaturesInExtent(extent),
      ].filter((f) => f.get('gpuVisible') === 1); // Only count what the GPU is actually showing

      const visiblePresence = showDetected
        ? presenceSource.getFeaturesInExtent(extent)
        : [];

      const visibleAbsence = showNotDetected
        ? absenceSource.getFeaturesInExtent(extent)
        : [];

      setVisiblePointCount(visible.length);

      const counts: Record<string, number> = {};

      for (const f of visible) {
        const sp = normalize(String(f.get('species') ?? 'unknown'));

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
  }, [map, occurrenceData, filters, showDetected, showNotDetected]);

  /* ---------------- Update selection highlighting in both layers ---------------- */

  useEffect(() => {
    const presenceSource = pointLayerRef.current?.getSource();

    const absenceSource = absenceLayerRef.current?.getSource();

    if (presenceSource) {
      updateSelectionAttributesWebGL(presenceSource, selectedIds);
    }

    if (absenceSource) {
      updateSelectionAttributesWebGL(absenceSource, selectedIds);
    }
  }, [selectedIds]);

  /* ---------------- update overlays & basemap ---------------- */

  useEffect(() => {
    if (!map) return;

    updateBaseMapStyles(mapStyles, mapOverlays, map);

    updateOverlayLayers(mapStyles, mapOverlays, map);
  }, [map, mapStyles, mapOverlays]);

  useEffect(() => {
    if (!map) return;

    updateWMTSLayers(wmtsLayers, map);
  }, [map, wmtsLayers]);

  /* ---------------- click handler ---------------- */

  useEffect(() => {
    if (!map) return;

    const handleClick = (evt: any) => {
      const ids: string[] = [];

      map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
        if (layer?.get('occurrence-data') || feat.get('id')) {
          ids.push(String(feat.get('id')));
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

  useEffect(() => {
    const presenceSource = pointLayerRef.current?.getSource();

    const absenceSource = absenceLayerRef.current?.getSource();

    const hoverPresenceSource = hoverPresenceLayerRef.current?.getSource();

    const hoverAbsenceSource = hoverAbsenceLayerRef.current?.getSource();

    if (
      !presenceSource ||
      !absenceSource ||
      !hoverPresenceSource ||
      !hoverAbsenceSource
    )
      return;

    const hovered = hoveredSpecies ? normalize(hoveredSpecies) : null;

    const updateMain = (source?: VectorSource<Point> | null) => {
      if (!source) return;

      source.getFeatures().forEach((f) => {
        const species = normalize(String(f.get('species') ?? ''));

        if (!hovered) {
          f.set('highlight', 0);
        } else if (species === hovered) {
          f.set('highlight', 1);
        } else {
          f.set('highlight', -1);
        }
      });

      source.changed();
    };

    updateMain(presenceSource);

    updateMain(absenceSource);

    hoverPresenceSource.clear();

    hoverAbsenceSource.clear();

    if (hovered) {
      const hoveredPresence = showDetected
        ? presenceSource

            .getFeatures()

            .filter(
              (f) => normalize(String(f.get('species') ?? '')) === hovered
            )
        : [];

      const hoveredAbsence = showNotDetected
        ? absenceSource

            .getFeatures()

            .filter(
              (f) => normalize(String(f.get('species') ?? '')) === hovered
            )
        : [];

      hoverPresenceSource.addFeatures(hoveredPresence);

      hoverAbsenceSource.addFeatures(hoveredAbsence);
    }

    hoverPresenceSource.changed();

    hoverAbsenceSource.changed();
  }, [hoveredSpecies, showDetected, showNotDetected]);

  /* ---------------- render ---------------- */

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
      <DrawerMap />

      <OverlayPanel />

      <Box component="main" sx={{ flexGrow: 1, position: 'relative' }}>
        <div
          id="mapDiv"
          ref={mapElement}
          style={{ height: 'calc(100vh - 150px)' }}
        />

        {/* Inject the Top-Tier UX Loader Here */}
        <MapLoader isLoading={occurrenceLoading} />
      </Box>
      {selectedIds.length > 0 && <DataDrawer />}
      <MapHUD
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        occurrenceLoading={occurrenceLoading}
        visiblePointCount={visiblePointCount}
        speciesCounts={speciesCounts}
        speciesStyles={speciesStyles}
        activeSpecies={activeSpecies}
        hoveredSpecies={hoveredSpecies}
        setHoveredSpecies={setHoveredSpecies}
        selectedIdsLength={selectedIds.length}
        speciesRowRefs={speciesRowRefs}
        normalize={normalize}
        showDetected={showDetected}
        setShowDetected={setShowDetected}
        showNotDetected={showNotDetected}
        setShowNotDetected={setShowNotDetected}
      />

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
    </Box>
  );
};

export default MapWrapperV3;
