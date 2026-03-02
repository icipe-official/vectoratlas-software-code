import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapOverlay, MapStyles, VectorAtlasFilters } from '../state.types';
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

export interface MapState {
  map_styles: MapStyles;
  map_overlays: MapOverlay[];
  currentSearchID: string;
  occurrence_data: any[];
  occurrence_status: 'idle' | 'loading' | 'succeeded' | 'failed';
  occurrenceLoading: boolean;
  map_drawer: {
    open: boolean;
    overlays: boolean;
    baseMap: boolean;
    filters: boolean;
    download: boolean;
    ir_overlays: boolean; // ← ADD
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
  // ── WMTS (GeoServer IR Overlays) ──
  wmtsLayers: WMTSLayerInfo[];
  wmtsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export const initialState: () => MapState = () => ({
  map_styles: { layers: [], scales: [] },
  map_overlays: [],
  occurrence_data: [],
  occurrence_status: 'idle',
  occurrenceLoading: false,
  currentSearchID: '',
  map_drawer: {
    open: false,
    overlays: false,
    baseMap: false,
    filters: false,
    download: false,
    ir_overlays: false, // ← ADD
  },
  filters: {
    country: { value: [] },
    species: { value: [] },
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
  filterValues: {
    country: countryList
      .slice()
      .map((c) => c.toLowerCase())
      .sort((a, b) => a.localeCompare(b)),
    species: speciesList
      .slice()
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
  },
  selectedIds: [],
  selectedData: [],
  areaSelectModeOn: false,
  lastProcessedPointIndex: 0,
  processedPoints: [],
  // ── WMTS initial state ──
  wmtsLayers: [],
  wmtsStatus: 'idle',
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
    updateOccurrence(
      state,
      action: PayloadAction<{ data: any[]; searchID: string }>
    ) {
      if (action.payload.searchID === state.currentSearchID) {
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
        case 'ir_overlays': // ← ADD
          state.map_drawer.ir_overlays = !state.map_drawer.ir_overlays; // ← ADD
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
      state.filters[action.payload.filterName].value =
        action.payload.filterOptions;
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
    // ── WMTS layer visibility toggle ──
    toggleWMTSLayerVisibility(state, action: PayloadAction<string>) {
      const layer = state.wmtsLayers.find((l) => l.name === action.payload);
      if (layer) {
        layer.isVisible = !layer.isVisible;
      }
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
      // ── WMTS extra reducers ──
      .addCase(getWMTSOverlays.pending, (state) => {
        state.wmtsStatus = 'loading';
      })
      .addCase(getWMTSOverlays.fulfilled, (state, action) => {
        state.wmtsStatus = 'succeeded';
        state.wmtsLayers = action.payload;
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
} = mapSlice.actions;

export default mapSlice.reducer;
