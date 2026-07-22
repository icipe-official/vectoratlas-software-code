import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  WMTSWorkspacesEnum,
  MapOverlay,
  MapStyles,
  VectorAtlasFilters,
} from '../state.types';
import { getMapStyles } from './actions/getMapStyles';
import { getTileServerOverlays } from './actions/getTileServerOverlays';
import { countryList, speciesList } from './utils/countrySpeciesLists';
import { unpackOverlays } from './utils/unpackOverlays';
import { getOccurrenceData } from './actions/getOccurrenceData';
import { getWMTSOverlays, WMTSLayerInfo } from './actions/getWmtsoverlays';

export interface DetailedOccurrence {
  id: string;
  year_start: number;
  month_start: number;
  binary_presence: string;
  sample: {
    sampling_occurrence_1: string;
  };
  recorded_species: {
    species: string;
  };
  reference: {
    author: string;
    year: number;
    citation: string;
  };
  bionomics: {
    adult_data: boolean;
    larval_site_data: boolean;
    season_given: string | null;
    season_calc: string | null;
  };
}

/** Represents a single layer at a specific point in time (or a time range) */
export interface TimeSeriesLayer {
  layerName: string; // The actual GeoServer layer name (e.g., 'an_gambiae_ir_2020')
  startTime: number; // Epoch ms (e.g., Jan 1, 2020 00:00:00)
  endTime: number; // Epoch ms (e.g., Dec 31, 2020 23:59:59)
  timeString: string; // Raw extracted string ('2020')
}

/** Represents a logical dataset/group that spans across time, identified by a path */
export interface TimeSeriesGroup {
  id: string; // The path-based ID (e.g., 'ir/ddt')
  groupName: string; // Display name for the UI (e.g., 'DDT')
  category: string; // Root category extracted from ID (e.g., 'ir')
  isPlaybackActive: boolean; // True if toggled ON in the UI
  startTime: number; // Epoch ms
  endTime: number; // Epoch ms
  temporalLayers: TimeSeriesLayer[]; // Pre-sorted chronologically
  defaultResolution?: 'day' | 'month' | 'year'; // Default slider resolution
}

/** The normalized state slice for managing all time series data */
export interface TimeSeriesConfig {
  currentTime: number | null; // Current slider time, converted to epoch ms for fast comparison

  currentStartTime: number | null; // Epoch ms
  currentEndTime: number | null;

  // A flat dictionary of all available time series groups, keyed by their path ID
  groups: Record<string, TimeSeriesGroup>;
  dataState: 'ready' | 'loading' | 'error';
}

export interface MapState {
  map_styles: MapStyles;
  map_overlays: MapOverlay[];
  currentSearchID: string;
  master_occurrence_data: any[];
  occurrence_data: any[];
  occurrence_status: 'idle' | 'loading' | 'succeeded' | 'failed';
  occurrenceLoading: boolean;
  map_drawer: {
    open: boolean;
    overlays: boolean;
    baseMap: boolean;
    filters: boolean;
    download: boolean;
    ir_overlays: boolean;
  };
  filters: VectorAtlasFilters;
  filterValues: {
    country: string[];
    species: string[];
  };
  selectedIds: string[];
  selectedData: DetailedOccurrence[];
  areaSelectModeOn: boolean;
  lastProcessedPointIndex: number;
  processedPoints: any[];
  timeSeries: TimeSeriesConfig;
  // ── WMTS (GeoServer IR Overlays) ──
  wmtsLayers: WMTSLayerInfo[];
  wmtsWorkspaces: WMTSWorkspacesEnum[];
  wmtsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  preloadTimeSeries: boolean;
  preloadingLayers: string[];
  filteredOccurrenceData: any[];
}

export const initialState: () => MapState = () => ({
  map_styles: { layers: [], scales: [] },
  map_overlays: [],
  master_occurrence_data: [],
  occurrence_data: [],
  occurrence_status: 'idle',
  occurrenceLoading: false,
  currentSearchID: '',
  map_drawer: {
    open: true, // SET TO TRUE FOR ALWAYS OPEN BY DEFAULT
    overlays: false,
    baseMap: false,
    filters: false,
    download: false,
    ir_overlays: false,
  },
  filters: {
    country: { value: [] },
    species: { value: [] },
    primary: { value: [] },     
    secondary: { value: [] },
    bionomics: { value: [] },
    insecticide: { value: [] },
    binary_presence: { value: [] },
    abundance_data: { value: [] },
    isLarval: { value: [] },
    isAdult: { value: [] },
    control: { value: [] },
    season: { value: [] },
    timeRange: {
      value: {
        start: null,
        end: null,
      },
    },
    areaCoordinates: { value: [] },
  },
  //Uses static list
  /*filterValues: {
    country: countryList
      .slice()
      .map((c) => c.toLowerCase())
      .sort((a, b) => a.localeCompare(b)),
    species: speciesList
      .slice()
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
  },*/
  filterValues: {
    country: [],
    species: [],
  },
  selectedIds: [],
  selectedData: [],
  areaSelectModeOn: false,
  lastProcessedPointIndex: 0,
  processedPoints: [],
  timeSeries: {
    currentTime: null,
    currentStartTime: null,
    currentEndTime: null,
    groups: {},
    dataState: 'ready',
  },
  // ── WMTS initial state ──
  wmtsLayers: [],
  wmtsWorkspaces: [],
  wmtsStatus: 'idle',
  preloadTimeSeries: true,
  preloadingLayers: [],
  filteredOccurrenceData: [],
});

export const mapSlice = createSlice({
  name: 'map',
  initialState: initialState(),
  reducers: {
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    startNewSearch(state, action: PayloadAction<string>) {
      state.currentSearchID = action.payload;
    },
    updateSelectedData(state, action: PayloadAction<DetailedOccurrence[]>) {
      state.selectedData = action.payload;
    },
    setFilteredData(state, action: PayloadAction<any[]>) {
      state.filteredOccurrenceData = action.payload;
    },
    updateOccurrence(
      state,
      action: PayloadAction<{ data: any[]; searchID: string }>
    ) {
      if (action.payload.searchID === state.currentSearchID) {
        state.master_occurrence_data = action.payload.data;
        state.occurrence_data = action.payload.data;
      }
    },
    setOccurrenceLoading(state, action: PayloadAction<boolean>) {
      state.occurrenceLoading = action.payload;
    },
    drawerToggle(state) {
      const map_drawer = state.map_drawer;
      if (map_drawer.open) {
        map_drawer.open = false;
        map_drawer.overlays = false;
        map_drawer.baseMap = false;
        map_drawer.filters = false;
        map_drawer.download = false;
        map_drawer.ir_overlays = false;
      } else {
        map_drawer.open = true;
      }
    },
    drawerListToggle(state, action: PayloadAction<string>) {
      switch (action.payload) {
        case 'overlays':
          state.map_drawer.overlays = !state.map_drawer.overlays;
          break;
        case 'baseMap':
          state.map_drawer.baseMap = !state.map_drawer.baseMap;
          break;
        case 'download':
          state.map_drawer.download = !state.map_drawer.download;
          break;
        case 'ir_overlays':
          state.map_drawer.ir_overlays = !state.map_drawer.ir_overlays;
          break;
        default:
          state.map_drawer.filters = !state.map_drawer.filters;
      }
    },
    layerToggle(state, action: PayloadAction<string>) {
      const overlayToToggle = state.map_overlays.find(
        (l: any) => l.name === action.payload
      );
      if (overlayToToggle)
        overlayToToggle.isVisible = !overlayToToggle.isVisible;
    },
    showLayerVisible(state, action: PayloadAction<string>) {
      const overlayToToggle = state.map_overlays.find(
        (l: any) => l.name === action.payload
      );
      if (overlayToToggle) overlayToToggle.isVisible = true;
    },
  filterHandler(state: any, action) {
  const { filterName, filterOptions } = action.payload;

  if (!state.filters[filterName]) {
    state.filters[filterName] = { value: [] };
  }

  state.filters[filterName].value = filterOptions;
},
    updateMapLayerColour(state, action) {
      const matchingLayer = state.map_styles.layers.find(
        (l) => l.name === action.payload.name
      );
      if (matchingLayer) {
        if (matchingLayer.colorChange === 'fill') {
          matchingLayer.fillColor = action.payload.color;
        } else {
          matchingLayer.strokeColor = action.payload.color;
        }
      }
    },
    toggleAreaMode(state, action: PayloadAction<boolean>) {
      state.areaSelectModeOn = action.payload;
    },
    updateAreaFilter(state, action: PayloadAction<any[]>) {
      state.filters.areaCoordinates.value = action.payload;
    },
    updateLastProcessedIndex(state, action: PayloadAction<number>) {
      state.lastProcessedPointIndex = action.payload;
    },
    updateProcessedPoints(state, action: PayloadAction<any[]>) {
      state.processedPoints = action.payload;
    },
    updateOverlayColorMap(
      state,
      action: PayloadAction<{ name: string; colorMapKey: string }>
    ) {
      const overlay = state.map_overlays.find(
        (o) => o.name === action.payload.name
      );
      if (overlay) {
        overlay.colorMapKey = action.payload.colorMapKey;
      }
    },
    toggleWMTSLayerVisibility(state, action: PayloadAction<string>) {
      const layerNameToToggle = action.payload;
      const layer = state.wmtsLayers.find((l) => l.name === layerNameToToggle);

      if (layer) {
        const isTurningOn = !layer.isVisible;

        // If turning a layer ON, disable all other overlays
        if (isTurningOn) {
          // Turn off all other WMTS layers
          state.wmtsLayers.forEach((l) => {
            l.isVisible = false;
          });
          // Turn off all time series groups
          Object.values(state.timeSeries.groups).forEach((g) => {
            g.isPlaybackActive = false;
          });
          // Reset time slider since no time series is active
          state.timeSeries.currentTime = null;
          state.preloadingLayers = [];
        }

        // Set the new state for the target layer
        layer.isVisible = isTurningOn;
      }
    },
    // ── WMTS layer visibility override (used by time series slider) ──
    setWMTSLayerVisibility(
      state,
      action: PayloadAction<{ name: string; isVisible: boolean }>
    ) {
      const layer = state.wmtsLayers.find(
        (l) => l.name === action.payload.name
      );
      if (layer) {
        layer.isVisible = action.payload.isVisible;
      }
    },
    // ── Time Series ──
    setCurrentTime(state, action: PayloadAction<number | null>) {
      state.timeSeries.currentTime = action.payload;
    },
    toggleTimeSeriesGroup(state, action: PayloadAction<TimeSeriesGroup>) {
      const groupToToggle = action.payload;
      const existing = state.timeSeries.groups[groupToToggle.id];
      const isTurningOn = existing ? !existing.isPlaybackActive : true;

      // If turning a group ON, disable all other overlays
      if (isTurningOn) {
        // Deactivate all other time series groups
        Object.values(state.timeSeries.groups).forEach((g) => {
          if (g.id !== groupToToggle.id) {
            g.isPlaybackActive = false;
          }
        });
        // Deactivate ALL WMTS layers. The slider will turn on the correct one.
        state.wmtsLayers.forEach((l) => {
          l.isVisible = false;
        });

        if (state.preloadTimeSeries) {
          state.preloadingLayers = groupToToggle.temporalLayers.map(
            (t) => t.layerName
          );
        }
      }

      // Update the target group's state
      if (existing) {
        existing.isPlaybackActive = isTurningOn;
      } else {
        state.timeSeries.groups[groupToToggle.id] = {
          ...groupToToggle,
          isPlaybackActive: true,
        };
      }

      // If turning a group OFF, explicitly hide its layers and reset time if it was the last one
      if (!isTurningOn && existing) {
        existing.temporalLayers.forEach((tLayer) => {
          const wmtsLayer = state.wmtsLayers.find(
            (l) => l.name === tLayer.layerName
          );
          if (wmtsLayer) {
            wmtsLayer.isVisible = false;
          }
        });

        state.preloadingLayers = [];
        const anyActive = Object.values(state.timeSeries.groups).some(
          (g) => g.isPlaybackActive
        );
        if (!anyActive) {
          state.timeSeries.currentTime = null;
        }
      }
    },
    togglePreloadTimeSeries(state) {
      state.preloadTimeSeries = !state.preloadTimeSeries;
      if (!state.preloadTimeSeries) {
        state.preloadingLayers = [];
      } else {
        const activeGroup = Object.values(state.timeSeries.groups).find(
          (g) => g.isPlaybackActive
        );
        if (activeGroup) {
          state.preloadingLayers = activeGroup.temporalLayers.map(
            (t) => t.layerName
          );
        }
      }
    },
    setSliderDataState(
      state,
      action: PayloadAction<'ready' | 'loading' | 'error'>
    ) {
      state.timeSeries.dataState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMapStyles.fulfilled, (state, action) => {
        state.map_styles = action.payload;
      })
      .addCase(getTileServerOverlays.fulfilled, (state, action) => {
        state.map_overlays = unpackOverlays(action.payload);
      })
      .addCase(getOccurrenceData.pending, (state) => {
        state.occurrence_status = 'loading';
        state.occurrenceLoading = true;
        state.occurrence_data = [];
      })
      .addCase(getOccurrenceData.fulfilled, (state) => {
        state.occurrence_status = 'succeeded';
        state.occurrenceLoading = false;
      })
      .addCase(getOccurrenceData.rejected, (state) => {
        state.occurrence_status = 'failed';
        state.occurrenceLoading = false;
      })
      .addCase(getWMTSOverlays.pending, (state) => {
        state.wmtsStatus = 'loading';
      })
      .addCase(getWMTSOverlays.fulfilled, (state, action) => {
        state.wmtsStatus = 'succeeded';
        state.wmtsLayers.push(...action.payload.layers);
        if (!state.wmtsWorkspaces.includes(action.payload.workspace))
          state.wmtsWorkspaces.push(action.payload.workspace);
      })
      .addCase(getWMTSOverlays.rejected, (state) => {
        state.wmtsStatus = 'failed';
      });
  },
});

export const {
  updateOccurrence,
  updateSelectedData,
  drawerToggle,
  drawerListToggle,
  layerToggle,
  showLayerVisible,
  filterHandler,
  startNewSearch,
  updateMapLayerColour,
  setSelectedIds,
  toggleAreaMode,
  updateAreaFilter,
  updateLastProcessedIndex,
  updateProcessedPoints,
  setOccurrenceLoading,
  updateOverlayColorMap,
  toggleWMTSLayerVisibility,
  setWMTSLayerVisibility,
  setCurrentTime,
  toggleTimeSeriesGroup,
  togglePreloadTimeSeries,
  setSliderDataState,
  setFilteredData,
} = mapSlice.actions;

export default mapSlice.reducer;
