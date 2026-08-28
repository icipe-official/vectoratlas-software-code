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

// OpenLayers provides this stylesheet at runtime, but does not ship TypeScript declarations for it.
// @ts-expect-error -- side-effect CSS import is handled by the bundler.
import 'ol/ol.css';

import { useTranslations } from 'next-intl';

import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { useSpeciesDb } from '../../shared/useSpeciesDb';
import { useCountryDb } from '../../shared/useCountryDb';
import dynamic from 'next/dynamic';
import {
  setSelectedIds,
  showLayerVisible,
  updateProcessedPoints,
  updateOccurrence,
  filterHandler,
  setSliderDataState,
  setOccurrenceLoading,
  startNewSearch,
  setSpeciesFilterValues,
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
  GENERIC_GREEN,
  updateSelectionAttributesWebGL,
  setCommonFeatureAttrs,
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
  const token = useAppSelector((state) => state.auth.token);
  const dbCountryData = useCountryDb(true, token as string | null);
  const [hoveredSpecies, setHoveredSpecies] = useState<string | null>(null);
  const [showDetected, setShowDetected] = useState(true);
  const [showNotDetected, setShowNotDetected] = useState(true);

  // NEW (doiOccurrenceIds): when the map is loaded via a DOI resolver link
  // (?doi=<id>), this holds the export job's occurrence_ids so the map/HUD
  // can be restricted to just that set of points. null = no DOI restriction
  // active; a (possibly empty) array = restriction active.
  const [doiOccurrenceIds, setDoiOccurrenceIds] = useState<string[] | null>(
    null
  );

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
  const [dbPrimarySpecies, setDbPrimarySpecies] = useState<string[]>([]);
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

    const fetchData = async () => {
      try {
        const response = await fetch(
          '/vector-api/full-occurrence-data/data?ext=json'
        );
        const data = await response.json();
        const searchID = 'id' + Math.random().toString(16).slice(2);
        dispatch(startNewSearch(searchID));
        dispatch(updateOccurrence({ data, searchID }));
      } catch (error) {
        console.error('Failed to load occurrence data:', error);
      }
    };

    fetchData();
  }, [occurrenceData.length, dispatch, mapReady]);

  //  Redux Map Data Builder
  useEffect(() => {
    const presenceSource = pointLayerRef.current?.getSource();
    const absenceSource = absenceLayerRef.current?.getSource();

    if (!presenceSource || !absenceSource || !mapReady) return;
    if (!speciesStyles || speciesStyles.length === 0) return;
    if (occurrenceData.length === 0) return;

    // Check if already loaded
    if (presenceSource.getFeatures().length > 0) return;

    try {
      const speciesColorMap = new Map<
        string,
        [number, number, number, number]
      >();
      speciesStyles.forEach((s) => {
        const cleanKey = String(s.species || '')
          .toLowerCase()
          .trim();
        speciesColorMap.set(cleanKey, cssColorToVec4(s.color));
      });

      const presenceFeatures: Feature<Point>[] = [];
      const absenceFeatures: Feature<Point>[] = [];

      occurrenceData.forEach((item) => {
        if (!item.location || !item.location.coordinates) return;

        const coords = transform(
          item.location.coordinates,
          'EPSG:4326',
          'EPSG:3857'
        );
        const f = new Feature({ geometry: new Point(coords) });

        // Feed all backend properties into the map feature
        Object.keys(item).forEach((key) => f.set(key, (item as any)[key]));

        // Fix boolean to integer mappings for the UI filters
        f.set('has_adult_int', item.has_adult ? 1 : 0);
        f.set('has_larval_int', item.has_larval ? 1 : 0);
        f.set('has_bionomics_int', item.has_bionomics ? 1 : 0);
        f.set('has_abundance_int', item.has_abundance ? 1 : 0);

        const species = normalize(String(f.get('species') ?? ''));
        const [r, g, b, a] =
          speciesColorMap.get(species) ?? cssColorToVec4('#038543');
        const presenceStatus = getPresenceStatus(f.get('binary_presence'));

        f.set('r', r);
        f.set('g', g);
        f.set('b', b);
        f.set('a', a);
        f.set('selected', 0);
        f.set('highlight', 0);
        f.set('presenceStatus', presenceStatus);
        f.set('isPresence', presenceStatus === 'presence' ? 1 : 0);
        f.set('isAbsence', presenceStatus === 'absence' ? 1 : 0);
        f.set('gpuVisible', 1);

        if (item.id) f.setId(item.id);

        if (presenceStatus === 'absence') {
          f.set('baseSize', 12);
          absenceFeatures.push(f);
        } else {
          f.set('baseSize', 9);
          presenceFeatures.push(f);
        }
      });

      presenceSource.addFeatures(presenceFeatures);
      absenceSource.addFeatures(absenceFeatures);
      setLoadedPresenceAbsenceLayers(true);
    } catch (error) {
      console.error('Failed to load map features:', error);
    }
  }, [mapReady, speciesStyles, occurrenceData]);

  useEffect(() => {
    if (!loadedPresenceAbsenceLayers) return;
    const presenceSource = pointLayerRef.current?.getSource();
    const absenceSource = absenceLayerRef.current?.getSource();
    if (!presenceSource || !absenceSource) return;

    const features = [
      ...presenceSource.getFeatures(),
      ...absenceSource.getFeatures(),
    ];
    features.forEach((f) => {
      if (f.get('gpuVisible') === undefined) {
        f.set('gpuVisible', 1);
      }
    });
    presenceSource.changed();
    absenceSource.changed();
  }, [loadedPresenceAbsenceLayers]);

  const previousFilterReference = useRef<VectorAtlasFilters | null>(null);
  // NEW (doiOccurrenceIds): tracked separately from previousFilterReference.
  // BUGFIX: the GPU filter guard below used to check `filters` by reference
  // only, so a doiOccurrenceIds-only update (no change to `filters`) was
  // silently skipped and the map kept showing the unfiltered point count.
  const previousDoiOccurrenceIdsRef = useRef<string[] | null>(null);

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
    // BUGFIX: check both `filters` and `doiOccurrenceIds` before bailing —
    // previously only `filters` was checked, so a doiOccurrenceIds-only
    // change (e.g. the DOI resolver fetch resolving after this effect's
    // first run) never triggered a re-filter.
    const filtersChanged = filters !== previousFilterReference.current;
    const doiIdsChanged =
      doiOccurrenceIds !== previousDoiOccurrenceIdsRef.current;

    if (!filtersChanged && !doiIdsChanged) return;
    if (
      previousFilterReference.current === null &&
      previousDoiOccurrenceIdsRef.current === null &&
      !filtersSet &&
      !doiOccurrenceIds
    )
      return;

    const presenceSource = pointLayerRef.current?.getSource();
    const absenceSource = absenceLayerRef.current?.getSource();
    if (!presenceSource || !absenceSource) return;

    if (!loadedPresenceAbsenceLayers) return;

    // NEW (doiOccurrenceIds): built once per effect run (not per feature)
    // for O(1) membership checks in the hot loop below.
    const doiIdSet = doiOccurrenceIds ? new Set(doiOccurrenceIds) : null;

    const runGpuFilter = (source: VectorSource<Point>) => {
      const features = source.getFeatures();

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

        // NEW (doiOccurrenceIds): when a DOI restriction is active, only
        // points whose id is in the export job's occurrence_ids survive —
        // checked first since it's the cheapest, most restrictive filter.
        if (visible && doiIdSet) {
          const featureId = String(f.getId() ?? f.get('id') ?? '');
          if (!doiIdSet.has(featureId)) {
            visible = 0;
          }
        }

        if (visible && allSelectedSpecies.length > 0) {
          const oSpecies = String(f.get('species') || '')
            .toLowerCase()
            .trim();
          if (!allSelectedSpecies.includes(oSpecies)) {
            visible = 0;
          }
        }

        // Robust Country Filter WITH Alternative Names
        if (visible && country?.value) {
          const featureCountry = String(f.get('country') || '')
            .toLowerCase()
            .trim();

          const countryArray = Array.isArray(country.value)
            ? country.value
            : [country.value];

          const selectedCountriesLower = countryArray.map((c: any) =>
            String(c || '')
              .toLowerCase()
              .trim()
          );

          if (selectedCountriesLower.length > 0) {
            let matchesSelection = false;

            for (const sc of selectedCountriesLower) {
              if (featureCountry === sc) {
                matchesSelection = true;
                break;
              }

              const dbMatch = dbCountryData.find(
                (dbC: any) =>
                  String(dbC.name || '')
                    .toLowerCase()
                    .trim() === sc
              );

              if (dbMatch && Array.isArray(dbMatch.alternative_names)) {
                const alts = dbMatch.alternative_names.map((alt: string) =>
                  String(alt || '')
                    .toLowerCase()
                    .trim()
                );
                if (alts.includes(featureCountry)) {
                  matchesSelection = true;
                  break;
                }
              }
            }

            if (!matchesSelection) {
              visible = 0;
            }
          }
        }

        if (visible && binary_presence.value.length > 0) {
          const status = getPresenceStatus(f.get('binary_presence'));
          if (status === 'absence' && !binary_presence.value.includes('False'))
            visible = 0;
          if (status === 'presence' && !binary_presence.value.includes('True'))
            visible = 0;
        }

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

        if (
          visible &&
          bionomics.value.includes(true) &&
          f.get('has_bionomics_int') !== 1
        )
          visible = 0;

        const year = f.get('year_start');
        if (visible && timeRange.value.start && year < timeRange.value.start)
          visible = 0;
        if (visible && timeRange.value.end && year > timeRange.value.end)
          visible = 0;

        if (visible && season?.value?.length > 0) {
          visible = season.value.includes(f.get('season_val')) ? 1 : 0;
        }

        if (visible && insecticide?.value?.length > 0) {
          visible = insecticide.value.includes(f.get('insecticide')) ? 1 : 0;
        }

        if (visible && control?.value?.length > 0) {
          visible = control.value.includes(f.get('control')) ? 1 : 0;
        }

        if (
          visible &&
          abundance_data.value.includes('True') &&
          f.get('has_abundance_int') !== 1
        )
          visible = 0;

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
      // NEW (doiOccurrenceIds): keep in sync with previousFilterReference so
      // the guard above can detect either kind of change independently.
      previousDoiOccurrenceIdsRef.current = doiOccurrenceIds;
    });

    return () => {
      if (filterFrameRef.current) {
        cancelAnimationFrame(filterFrameRef.current);
      }
    };
  }, [
    filters,
    filtersSet,
    loadedPresenceAbsenceLayers,
    dbCountryData,
    doiOccurrenceIds, // NEW (doiOccurrenceIds)
  ]);

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

  /* ---------------- Database Species Hook ---------------- */
  const dbSpeciesData = useSpeciesDb(true);

  useEffect(() => {
    if (!dbSpeciesData || dbSpeciesData.length === 0) return;
    const uniqueSpeciesNames = Array.from(
      new Set(dbSpeciesData.map((s) => s.species).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    dispatch(setSpeciesFilterValues(uniqueSpeciesNames));

    const primarySpeciesNames = dbSpeciesData
      .filter((s) => s.category === 'Primary')
      .map((s) => s.species)
      .filter(Boolean);
    setDbPrimarySpecies(primarySpeciesNames);

    const baseStyles = getSpeciesStyles(uniqueSpeciesNames);

    const styles: speciesStyle[] = baseStyles.map((baseStyle) => {
      const dbMatch = dbSpeciesData.find(
        (dbSp) => normalize(dbSp.species) === normalize(baseStyle.species)
      );

      return {
        ...baseStyle,
        color: dbMatch?.color || GENERIC_GREEN,
      };
    });

    setSpeciesStyles(styles);
  }, [dbSpeciesData, dispatch]);

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

        // NEW (doiOccurrenceIds): pull the export job's occurrence_ids out
        // of the resolver response so the map/HUD can be scoped to them.
        // TODO: confirm this path against the actual DoiService response
        // shape (export_job vs exportJob) once verified against the API —
        // both are checked here defensively in the meantime.
        const fetchedOccurrenceIds =
          data?.export_job?.occurrence_ids ??
          data?.exportJob?.occurrence_ids ??
          null;

        if (Array.isArray(fetchedOccurrenceIds)) {
          setDoiOccurrenceIds(fetchedOccurrenceIds.map((id: unknown) => String(id)));
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

    const activeWmtsOverlay = wmtsLayers.find(
      (l) => l.isVisible === true
    ) as any;

    const activeSpeciesOverlay = mapOverlays.find(
      (l) => l.sourceLayer === 'overlays' && l.isVisible === true
    ) as any;

    let activeOverlayLabel = '';
    let activeOverlayYear: string | number | null = null;

    const irYearMatch = activeWmtsOverlay?.name?.match(/_ir_(\d{4})/);

    if (activeWmtsOverlay && irYearMatch) {
      activeOverlayYear = irYearMatch[1];
      activeOverlayLabel = `Insecticide: ${activeWmtsOverlay.title}`;
    } else if (activeWmtsOverlay) {
      activeOverlayLabel = `Species Distribution: ${activeWmtsOverlay.title}`;
    } else if (activeSpeciesOverlay) {
      activeOverlayLabel = `Species Distribution: ${
        activeSpeciesOverlay.displayName || activeSpeciesOverlay.name
      }`;
    }

    return registerDownloadHandler(
      map,
      {
        species: { value: allSelectedSpecies },
        overlay: activeOverlayLabel,
        year: activeOverlayYear,
      },
      speciesStyles,
      dbPrimarySpecies,
      dbSpeciesData
    );
  }, [map, filters, speciesStyles, mapOverlays, wmtsLayers, dbPrimarySpecies]);

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
          doiOccurrenceIds={doiOccurrenceIds} // NEW (doiOccurrenceIds)
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