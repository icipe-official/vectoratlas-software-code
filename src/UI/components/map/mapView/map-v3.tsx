import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';

import OlMap from 'ol/Map';

import View from 'ol/View';

import { transform } from 'ol/proj';

import Box from '@mui/material/Box';

import { Stack, Typography, useMediaQuery } from '@mui/material';

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
  updateOccurrence,
  filterHandler,
  setSliderDataState,
  setOccurrenceLoading,
  startNewSearch,
} from '../../../state/map/mapSlice';

import { getFullOccurrenceData } from '../../../state/map/actions/getFullOccurrenceData';

import {
  buildBaseMapLayer,
  updateBaseMapStyles,
  updateOverlayLayers,
  updateWMTSLayers,
} from './layerUtils';

import {
  cssColorToVec4,
  getSpeciesStyles,
  updateSelectionAttributesWebGL,
} from './pointutilswebgl';

import { speciesStyle } from './types';

import DrawerMap from '../layers/drawerMap';

import DataDrawer from '../layers/dataDrawer';

import MapHUD from './MapHUD-v3';
import MapLoader from './maploader';
import { OverlayPanel } from '../layers/OverlayPanel';
import { TimeSeriesMapSlider } from './DateTimeSlider';
import { registerDownloadHandler } from './downloadImageHandler';
import theme from '../../../styles/theme';
import { VectorAtlasFilters } from '../../../state/state.types';

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

  const [showNotDetected, setShowNotDetected] = useState(true);

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
  const preloadingLayers = useAppSelector((s) => s.map.preloadingLayers);

  const areaModeOn = useAppSelector((s) => s.map.areaSelectModeOn);
  const occurrenceStatus = useAppSelector(
    (state) => state.map.occurrence_status
  );
  const [mapReady, setMapReady] = useState(false);

  const masterData = useAppSelector((s) => s.map.master_occurrence_data);
  const featuresInitialized = useRef(false);
  const processedCount = useRef(0);

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

  /* ---------------- Map tile loading tracking ---------------- */
  const activeTiles = useRef(0);
  const tileErrors = useRef(0);

  const handleTileLoadStart = useCallback(() => {
    if (activeTiles.current === 0) {
      dispatch(setSliderDataState('loading'));
    }
    activeTiles.current++;
  }, [dispatch]);

  const handleTileLoadEnd = useCallback(() => {
    activeTiles.current = Math.max(0, activeTiles.current - 1);
    if (activeTiles.current === 0) {
      if (tileErrors.current > 0) {
        dispatch(setSliderDataState('error'));
        tileErrors.current = 0;
      } else {
        if (map) {
          map.once('rendercomplete', () => {
            if (activeTiles.current === 0) {
              dispatch(setSliderDataState('ready'));
            }
          });
        } else {
          dispatch(setSliderDataState('ready'));
        }
      }
    }
  }, [dispatch, map]);

  const handleTileLoadError = useCallback(() => {
    activeTiles.current = Math.max(0, activeTiles.current - 1);
    tileErrors.current++;
    if (activeTiles.current === 0) {
      dispatch(setSliderDataState('error'));
      tileErrors.current = 0;
    }
  }, [dispatch]);

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

  const [loadedPresenceAbsenceLayers, setLoadedPresenceAbsenceLayers] =
    useState(false);

  useEffect(() => {
    if (occurrenceData.length > 0 && loadedPresenceAbsenceLayers) {
      dispatch(setOccurrenceLoading(false));
    } else {
      dispatch(setOccurrenceLoading(true));
    }
  }, [occurrenceData.length, loadedPresenceAbsenceLayers]);

  useEffect(() => {
    if (!mapReady) return;
    if (occurrenceData.length > 0) return;

    // Fetch data.json directly instead of GraphQL
    const fetchData = async () => {
      try {
        const response = await fetch(
          '/vector-api/full-occurrence-data/data?ext=json'
        );
        const data = await response.json();
        // Generate search ID and start new search
        const searchID = 'id' + Math.random().toString(16).slice(2);
        dispatch(startNewSearch(searchID));
        // Update Redux store with the full dataset
        dispatch(updateOccurrence({ data, searchID }));
      } catch (error) {
        console.error('Failed to load occurrence data:', error);
      }
    };

    fetchData();
  }, [occurrenceData.length, dispatch, mapReady]);

  useEffect(() => {
    const presenceSource = pointLayerRef.current?.getSource();
    const absenceSource = absenceLayerRef.current?.getSource();

    // Wait until the map layers are ready
    if (!presenceSource || !absenceSource) return;

    // Load presence and absence GeoJSON directly once when map is ready
    const loadGeoJSON = async () => {
      // Check if already loaded
      if (presenceSource.getFeatures().length > 0) return;

      try {
        // Load presence data (coordinates in EPSG:3857)
        const presenceResponse = await fetch(
          '/vector-api/full-occurrence-data/presence?ext=geojson'
        );
        const presenceGeoJSON = await presenceResponse.json();
        const presenceFeatures = new GeoJSON().readFeatures(
          presenceGeoJSON
        ) as Feature<Point>[];
        presenceSource.addFeatures(presenceFeatures);

        // Load absence data (coordinates in EPSG:3857)
        const absenceResponse = await fetch(
          '/vector-api/full-occurrence-data/absence?ext=geojson'
        );
        const absenceGeoJSON = await absenceResponse.json();
        const absenceFeatures = new GeoJSON().readFeatures(
          absenceGeoJSON
        ) as Feature<Point>[];
        absenceSource.addFeatures(absenceFeatures);
      } catch (error) {
        console.error('Failed to load GeoJSON:', error);
      } finally {
        setLoadedPresenceAbsenceLayers(true);
      }
    };

    loadGeoJSON();
  }, [mapReady]);

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

  const previousFilterReference = useRef<VectorAtlasFilters | null>(null);

  const filtersSet = useMemo(() => {
    const hasAnySelectedSpecies = Object.entries(filters)
      .filter(([key]) =>
        ['species', 'primary', 'secondary'].includes(String(key).toLowerCase())
      )
      .some(([_, f]: any) => Array.isArray(f?.value) && f.value.length > 0);

    const {
      country,
      binary_presence,
      isAdult,
      isLarval,
      bionomics,
      timeRange,
      season,
      insecticide,
      control,
      abundance_data,
    } = filters;

    return (
      hasAnySelectedSpecies ||
      (country?.value?.length ?? 0) > 0 ||
      (binary_presence?.value?.length ?? 0) > 0 ||
      isAdult?.value?.includes(true) ||
      isLarval?.value?.includes(true) ||
      bionomics?.value?.includes(true) ||
      timeRange?.value?.start !== null ||
      timeRange?.value?.end !== null ||
      (season?.value?.length ?? 0) > 0 ||
      (insecticide?.value?.length ?? 0) > 0 ||
      (control?.value?.length ?? 0) > 0 ||
      (abundance_data?.value?.length ?? 0) > 0
    );
  }, [filters]);

  const filterFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (filters === previousFilterReference.current) return;
    if (previousFilterReference.current === null && !filtersSet) return;

    const presenceSource = pointLayerRef.current?.getSource();
    const absenceSource = absenceLayerRef.current?.getSource();
    if (!presenceSource || !absenceSource) return;

    if (!loadedPresenceAbsenceLayers) return;

    console.error('FILTERS RUN');

    const runGpuFilter = (source: VectorSource<Point>) => {
      const features = source.getFeatures();
      if (features.length > 0) {
        console.log('Debug - Feature Data Sample:', {
          species: features[0].get('species'),
          country: features[0].get('country'),
          year: features[0].get('year_start'),
          hasAdult: features[0].get('has_adult_int'),
        });
      }

      const allSelectedSpecies = Object.entries(filters)
        .filter(([key]) =>
          ['species', 'primary', 'secondary'].includes(
            String(key).toLowerCase()
          )
        )
        .flatMap(([_, f]: any) => (Array.isArray(f?.value) ? f.value : []))
        .map((s: string) => String(s).toLowerCase().trim());

      const {
        country,
        binary_presence,
        isAdult,
        isLarval,
        bionomics,
        timeRange,
        season,
        insecticide,
        control,
        abundance_data,
      } = filters;

      for (let i = 0; i < features.length; i++) {
        const f = features[i];
        let visible = 1;
        //fuzzy logic of matching
        /*if (visible && allSelectedSpecies.length > 0) {
          const oSpecies = String(f.get('species') || '').toLowerCase().trim();
          const hasMatch = allSelectedSpecies.some((selectedSp) => 
            oSpecies.includes(selectedSp) || selectedSp.includes(oSpecies)
          );
          if (!hasMatch) {
            visible = 0;
          }
        }*/
        if (visible && allSelectedSpecies.length > 0) {
          const oSpecies = String(f.get('species') || '')
            .toLowerCase()
            .trim();
          if (!allSelectedSpecies.includes(oSpecies)) {
            visible = 0;
          }
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
        if (
          visible &&
          isAdult.value.includes(true) &&
          f.get('has_adult_int') !== 1
        )
          visible = 0;
        if (
          visible &&
          isLarval.value.includes(true) &&
          f.get('has_larval_int') !== 1
        )
          visible = 0;

        // 5. General Bionomics Filter
        if (
          visible &&
          bionomics.value.includes(true) &&
          f.get('has_bionomics_int') !== 1
        )
          visible = 0;

        // 6. Time Range Filter
        const year = f.get('year_start_epoch');
        if (visible && timeRange.value.start && year < timeRange.value.start)
          visible = 0;
        if (visible && timeRange.value.end && year > timeRange.value.end)
          visible = 0;

        // 7. Season Filter
        if (visible && season?.value?.length > 0) {
          visible = season.value.includes(f.get('season_val')) ? 1 : 0;
        }

        // Add logic for Insecticide
        if (visible && insecticide?.value?.length > 0) {
          visible = insecticide.value.includes(f.get('insecticide')) ? 1 : 0;
        }

        // Add logic for Control
        if (visible && control?.value?.length > 0) {
          visible = control.value.includes(f.get('control')) ? 1 : 0;
        }

        // Abundance data
        if (
          visible &&
          abundance_data.value.includes('True') &&
          f.get('has_abundance_int') !== 1
        )
          visible = 0;

        // Update attribute (GPU picks this up instantly)
        if (f.get('gpuVisible') !== visible) {
          f.set('gpuVisible', visible);
        }
      }
      source.changed(); // Trigger Redraw
    };

    filterFrameRef.current = requestAnimationFrame(() => {
      runGpuFilter(presenceSource);
      runGpuFilter(absenceSource);
      previousFilterReference.current = filters;
    });

    return () => {
      if (filterFrameRef.current) {
        cancelAnimationFrame(filterFrameRef.current);
      }
    };
  }, [filters, filtersSet, loadedPresenceAbsenceLayers]);

  // Enusre absence layer is visible whenever binary_presence is 'false'
  useEffect(() => {
    if (
      !filters.binary_presence.value ||
      filters.binary_presence.value.length === 0
    )
      return;
    if (filters.binary_presence.value.includes('False') && !showNotDetected) {
      setShowNotDetected(true);
    }
  }, [filters]);

  /* ---------------- init map ONCE ---------------- */

  useEffect(() => {
    if (!mapElement.current || map) return;

    dispatch(updateProcessedPoints([]));

    const baseLayer = buildBaseMapLayer();

    const styles = getSpeciesStyles(fullSpeciesList);

    setSpeciesStyles(styles);

    // Create empty vector sources for presence and absence
    const presenceSource = new VectorSource<Point>();
    const absenceSource = new VectorSource<Point>();
    const hoverPresenceSource = new VectorSource<Point>();
    const hoverAbsenceSource = new VectorSource<Point>();

    // Create WebGL layers with styling (preserving the original styling configuration)
    const presenceLayer = new WebGLPointsLayer({
      source: presenceSource,
      style: {
        symbol: {
          symbolType: 'circle',
          size: [
            '*',
            [
              'case',
              ['==', ['get', 'highlight'], 1.5],
              ['*', ['get', 'baseSize'], 1.8],
              ['*', ['get', 'baseSize'], 1.3],
            ],
            ['get', 'gpuVisible'],
          ],
          color: [
            'array',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'r'], 1.4],
              ['get', 'r'],
            ],
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'g'], 1.4],
              ['get', 'g'],
            ],
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'b'], 1.4],
              ['get', 'b'],
            ],
            ['get', 'a'],
          ],
          opacity: [
            '*',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              0.95,
              ['==', ['get', 'highlight'], -1],
              0.18,
              0.95,
            ],
            ['get', 'gpuVisible'],
          ],
        },
      },
    });
    const absenceLayer = new WebGLPointsLayer({
      source: absenceSource,
      style: {
        symbol: {
          symbolType: 'triangle',
          size: [
            '*',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'baseSize'], 1.8],
              ['*', ['get', 'baseSize'], 1.3],
            ],
            ['get', 'gpuVisible'],
          ],
          color: [
            'array',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'r'], 1.1],
              ['get', 'r'],
            ],
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'g'], 1.1],
              ['get', 'g'],
            ],
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'b'], 1.1],
              ['get', 'b'],
            ],
            ['get', 'a'],
          ],
          opacity: [
            '*',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              0.95,
              ['==', ['get', 'highlight'], -1],
              0.18,
              0.95,
            ],
            ['get', 'gpuVisible'],
          ],
        },
      },
    });
    const hoverPresenceLayer = new WebGLPointsLayer({
      source: hoverPresenceSource,
      style: {
        symbol: {
          symbolType: 'circle',
          size: [
            '*',
            [
              'case',
              ['==', ['get', 'highlight'], 1.5],
              ['*', ['get', 'baseSize'], 1.8],
              ['*', ['get', 'baseSize'], 1.3],
            ],
            ['get', 'gpuVisible'],
          ],
          color: [
            'array',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'r'], 1.4],
              ['get', 'r'],
            ],
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'g'], 1.4],
              ['get', 'g'],
            ],
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'b'], 1.4],
              ['get', 'b'],
            ],
            ['get', 'a'],
          ],
          opacity: [
            '*',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              0.95,
              ['==', ['get', 'highlight'], -1],
              0.18,
              0.95,
            ],
            ['get', 'gpuVisible'],
          ],
        },
      },
    });
    const hoverAbsenceLayer = new WebGLPointsLayer({
      source: hoverAbsenceSource,
      style: {
        symbol: {
          symbolType: 'triangle',
          size: [
            '*',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'baseSize'], 1.8],
              ['*', ['get', 'baseSize'], 1.3],
            ],
            ['get', 'gpuVisible'],
          ],
          color: [
            'array',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'r'], 1.1],
              ['get', 'r'],
            ],
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'g'], 1.1],
              ['get', 'g'],
            ],
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              ['*', ['get', 'b'], 1.1],
              ['get', 'b'],
            ],
            ['get', 'a'],
          ],
          opacity: [
            '*',
            [
              'case',
              ['==', ['get', 'highlight'], 1],
              0.95,
              ['==', ['get', 'highlight'], -1],
              0.18,
              0.95,
            ],
            ['get', 'gpuVisible'],
          ],
        },
      },
    });

    hoverPresenceLayer.set('hover-layer', true);

    hoverAbsenceLayer.set('hover-layer', true);

    hoverPresenceLayer.setZIndex(110);

    hoverAbsenceLayer.setZIndex(111);

    presenceLayer.setZIndex(100);

    absenceLayer.setZIndex(101);

    pointLayerRef.current = presenceLayer;

    absenceLayerRef.current = absenceLayer;

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
    setMapReady(true);

    return () => {
      olMap.setTarget(undefined);

      olMap.dispose();
    };
  }, [dispatch]); // eslint-disable-line  

  /* ---------------- layer visibility toggles ---------------- */

  useEffect(() => {
    pointLayerRef.current?.setVisible(showDetected);

    hoverPresenceLayerRef.current?.setVisible(showDetected);
  }, [showDetected]);

  useEffect(() => {
    absenceLayerRef.current?.setVisible(showNotDetected);

    hoverAbsenceLayerRef.current?.setVisible(showNotDetected);

    if (showNotDetected) return;

    if (filters.binary_presence.value.includes('False')) {
      dispatch(
        filterHandler({
          filterName: 'binary_presence',
          filterOptions: [],
        })
      );
    }
  }, [showNotDetected]);

  /* ---------------- Update species styles ---------------- */

  useEffect(() => {
    if (!fullSpeciesList.length) return;

    setSpeciesStyles(getSpeciesStyles(fullSpeciesList));
  }, [fullSpeciesList]);

  /* ---------------- Viewport-aware HUD counts from both layers ---------------- */

  useEffect(() => {
    // 1. Abort if the map hasn't finished building yet
    if (!mapReady) return;
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
  }, [map, occurrenceData, filters, showDetected, showNotDetected, mapReady]);

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

    const layersWithPreload = wmtsLayers.map((l) => ({
      ...l,
      isPreloading: (preloadingLayers || []).includes(l.name),
    }));

    updateWMTSLayers(layersWithPreload, map, {
      onLoadStart: handleTileLoadStart,
      onLoadEnd: handleTileLoadEnd,
      onLoadError: handleTileLoadError,
    });
  }, [
    map,
    wmtsLayers,
    preloadingLayers,
    handleTileLoadStart,
    handleTileLoadEnd,
    handleTileLoadError,
  ]);

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
  }, [drawerOpen, selectedIds.length, map]);

  /* ---------------- DOI filters ---------------- */

  useEffect(() => {
    if (!doiResolverId || occurrenceLoading) return;

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
  }, [doiResolverId, dispatch, occurrenceLoading]);

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

  /* Register map download handler */
  useEffect(() => {
    if (!map) return;

    const allSelectedSpecies = Object.entries(filters)
      .filter(([key]) =>
        ['species', 'primary', 'secondary'].includes(String(key).toLowerCase())
      )
      .flatMap(([_, f]: any) => (Array.isArray(f?.value) ? f.value : []));

    return registerDownloadHandler(
      map,
      { value: allSelectedSpecies },
      speciesStyles
    );
  }, [map, filters, speciesStyles]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /* ---------------- render ---------------- */

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <DrawerMap />

      <Box
        sx={{ flex: 9.5, flexGrow: 1, display: 'flex', position: 'relative' }}
      >
        {/** Floating panels */}
        <Stack
          direction="column"
          spacing={1}
          sx={{
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Stack
            direction="row"
            justifyContent={'space-between'}
            sx={{ flex: 9, overflow: 'hidden' }}
          >
            <OverlayPanel />
          </Stack>
          <Stack
            direction="row"
            sx={[
              isMobile
                ? { paddingBottom: '65px', paddingRight: '20px' }
                : { maxWidth: '85%' },
            ]}
          >
            <div style={{ zIndex: 2, width: '100%' }}>
              <TimeSeriesMapSlider />
            </div>
          </Stack>
        </Stack>

        <Box
          component="main"
          sx={{ flex: 1, display: 'flex', position: 'relative' }}
        >
          <div
            id="mapDiv"
            ref={mapElement}
            style={{ flex: 1, overflow: 'hidden' }}
          />

          {/* Inject the Top-Tier UX Loader Here */}
          <MapLoader isLoading={occurrenceLoading} />
        </Box>

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

              top: 50,

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

      {selectedIds.length > 0 && <DataDrawer />}
    </Box>
  );
};

export default MapWrapperV3;
