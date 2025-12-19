import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapOverlay, MapStyles, VectorAtlasFilters } from '../state.types';
import { getMapStyles } from './actions/getMapStyles';
import { getTileServerOverlays } from './actions/getTileServerOverlays';
import { countryList, speciesList } from './utils/countrySpeciesLists';
import { unpackOverlays } from './utils/unpackOverlays';
import { getOccurrenceData } from './actions/getOccurrenceData';

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
  occurrence_progress: number;
  map_drawer: {
    open: boolean;
    overlays: boolean;
    baseMap: boolean;
    filters: boolean;
    download: boolean;
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
}

export const initialState: () => MapState = () => ({
  map_styles: { layers: [], scales: [] },
  map_overlays: [],
  occurrence_data: [],
  occurrence_status: 'idle',
  occurrence_progress: 0,
  currentSearchID: '',
  map_drawer: {
    open: false,
    overlays: false,
    baseMap: false,
    filters: false,
    download: false,
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
      .map((s) => s.toLowerCase())
      .sort((a, b) => a.localeCompare(b)),
  },
  selectedIds: [],
  selectedData: [],
  areaSelectModeOn: false,
  lastProcessedPointIndex: 0,
  processedPoints: [],
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
    setOccurrenceProgress(state, action: PayloadAction<number>) {
      state.occurrence_progress = action.payload;
    },
    drawerToggle(state) {
      const map_drawer = state.map_drawer;
      if (map_drawer.open) {
        map_drawer.open = false;
        map_drawer.overlays = false;
        map_drawer.baseMap = false;
        map_drawer.filters = false;
        map_drawer.download = false;
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
        state.occurrence_progress = 0;
        state.occurrence_data = [];
      })
      .addCase(getOccurrenceData.fulfilled, (state) => {
        state.occurrence_status = 'succeeded';
        state.occurrence_progress = 100;
      })
      .addCase(getOccurrenceData.rejected, (state) => {
        state.occurrence_status = 'failed';
        state.occurrence_progress = 0;
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
  setOccurrenceProgress,
} = mapSlice.actions;

export default mapSlice.reducer;
