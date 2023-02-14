import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapOverlay, MapStyles, VectorAtlasFilters } from '../state.types';
import { getMapStyles } from './actions/getMapStyles';
import { getTileServerOverlays } from './actions/getTileServerOverlays';
import { countryList, speciesList } from './utils/countrySpeciesLists';
import { unpackOverlays } from './utils/unpackOverlays';

export interface DetailedOccurrence {
  id: string;
  year_start: number;
  month_start: number;
  sample: {
    mossamp_tech_1: string;
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
}

export const initialState: () => MapState = () => ({
  map_styles: { layers: [] },
  map_overlays: [],
  occurrence_data: [],
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
    country: countryList.slice().sort(),
    species: speciesList.slice().sort(),
  },
  selectedIds: [],
  selectedData: [],
  areaSelectModeOn: false,
});

export const mapSlice = createSlice({
  name: 'map',
  initialState: initialState(),
  reducers: {
    setSelectedIds(state, action) {
      state.selectedIds = action.payload;
    },
    startNewSearch(state, action) {
      state.currentSearchID = action.payload;
    },
    updateSelectedData(state, action) {
      state.selectedData = action.payload;
    },
    updateOccurrence(state, action) {
      if (action.payload.searchID === state.currentSearchID) {
        state.occurrence_data = action.payload.data;
      }
    },
    drawerToggle(state) {
      const map_drawer = state.map_drawer;
      if (state.map_drawer.open === true) {
        map_drawer.open = false;
        map_drawer.overlays = false;
        map_drawer.baseMap = false;
        map_drawer.filters = false;
        map_drawer.download = false;
      } else {
        map_drawer.open = true;
      }
    },
    drawerListToggle(state, action: PayloadAction<String>) {
      action.payload === 'overlays'
        ? (state.map_drawer.overlays = !state.map_drawer.overlays)
        : action.payload === 'baseMap'
        ? (state.map_drawer.baseMap = !state.map_drawer.baseMap)
        : action.payload === 'download'
        ? (state.map_drawer.download = !state.map_drawer.download)
        : (state.map_drawer.filters = !state.map_drawer.filters);
    },
    layerToggle(state, action: PayloadAction<String>) {
      const overlayToToggle = state.map_overlays.find(
        (l: any) => l.name === action.payload
      );
      if (!overlayToToggle) {
        return;
      }
      overlayToToggle.isVisible = !overlayToToggle.isVisible;
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
    toggleAreaMode(state, action) {
      state.areaSelectModeOn = action.payload;
    },
    updateAreaFilter(state, action) {
      state.filters.areaCoordinates.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMapStyles.fulfilled, (state, action) => {
        state.map_styles = action.payload;
      })
      .addCase(getTileServerOverlays.fulfilled, (state, action) => {
        state.map_overlays = unpackOverlays(action.payload);
      });
  },
});

export const {
  updateOccurrence,
  updateSelectedData,
  drawerToggle,
  drawerListToggle,
  layerToggle,
  filterHandler,
  startNewSearch,
  updateMapLayerColour,
  setSelectedIds,
  toggleAreaMode,
  updateAreaFilter,
} = mapSlice.actions;
export default mapSlice.reducer;
