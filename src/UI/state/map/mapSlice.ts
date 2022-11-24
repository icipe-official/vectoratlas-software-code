import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchMapStyles,
  fetchSpeciesList,
  fetchTileServerOverlays,
} from '../../api/api';
import { occurrenceQuery, fullOccurrenceQuery } from '../../api/queries';
import { unpackOverlays } from './mapSliceUtils';
import { VectorAtlasFilters } from '../state.types';
import { AppState } from '../store';

const countryList = [
  'Algeria',
  'Angola',
  'Benin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cameroon',
  'Central African Republic (CAR)',
  'Chad',
  'Comoros',
  'Congo, Democratic Republic of the',
  'Congo, Republic of the',
  'Cote d’Ivoire',
  'Djibouti',
  'Egypt',
  'Equatorial Guinea',
  'Eritrea',
  'Eswatini',
  'Ethiopia',
  'Gabon',
  'Gambia',
  'Ghana',
  'Guinea',
  'Guinea-Bissau',
  'Kenya',
  'Lesotho',
  'Liberia',
  'Libya',
  'Madagascar',
  'Malawi',
  'Mali',
  'Mauritania',
  'Mauritius',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Niger',
  'Nigeria',
  'Rwanda',
  'Sao Tome and Principe',
  'Senegal',
  'Seychelles',
  'Sierra Leone',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Sudan',
  'Tanzania',
  'Togo',
  'Tunisia',
  'Uganda',
  'Zambia',
  'Zimbabwe',
];

const speciesList = [
  'coustani',
  'pauliani',
  'comorensis',
  'ovengensis',
  'cinctus',
  'bervoetsi',
  'njombiensis',
  'okuensis',
  'berghei',
  'mortiauxi',
  'funestus-like',
  'arabiensis',
  'culicifacies',
  'fuscivenosus',
  'quadriannulatus',
  'dthali',
  'domicola',
  'fontinalis',
  'squamosus',
  'hancocki',
  'faini',
  'maculipalpis',
  'funestus',
  'buxtoni',
  'dureni',
  'jebudensis',
  'rhodesiensis',
  'grassei',
  'paludis',
  'seretsei',
  'erythraeus',
  'eouzani',
  'notleyi',
  'gabonensis',
  'hargreavesi',
  'dancalicus',
  'somalicus',
  'longipalpis',
  'kingi',
  'vernus',
  'cameroni',
  'fontenillei',
  'hervyi',
  'brucei',
  'ranci',
  'vinckei',
  'rivulorum-like',
  'radama',
  'erepens',
  'confusus',
  'austenii',
  'letabensis',
  'cydippis',
  'seydeli',
  'deemingi',
  'carteri',
  'wellcomei',
  'christyi',
  'concolor',
  'keniensis',
  'ruarinus',
  'moucheti',
  'grenieri',
  'mascarensis',
  'barberellus',
  'stephensi',
  'gibbinsi',
  'lovettae',
  'flavicosta',
  'murphyi',
  'milloti',
  'azevedoi',
  'turkhudi',
  'griveaudi',
  'brohieri',
  'roubaudi',
  'mousinhoi',
  'daudi',
  'multicolor',
  'multicinctus',
  'caroni',
  'carnevalei',
  'swahilicus',
  'cinereus',
  'harperi',
  'aruni',
  'fuscicolor',
  'ardensis',
  'nili',
  'rufipes',
  'freetownensis',
  'machardyi',
  'obscurus',
  'hamoni',
  'ziemanni',
  'dualaensis',
  'vaneedeni',
  'rivulorum',
  'walravensi',
  'garnhami',
  'vanhoofi',
  'kosiensis',
  'demeilloni',
  'argenteolobatus',
  'schwetzi',
  'natalensis',
  'marshallii',
  'ethiopicus',
  'lacani',
  'bwambae',
  'pharoensis',
  'namibiensis',
  'implexus',
  'parensis',
  'merus',
  'distinctus',
  'pretoriensis',
  'hughi',
  'gambiae',
  'symesi',
  'listeri',
  'lounibosi',
  'caliginosus',
  'lloreti',
  'tenebrosus',
  'smithii',
  'wilsoni',
  'maliensis',
  'azaniae',
  'salbaii',
  'crypticus',
  'sergentii',
  'theileri',
  'amharicus',
  'millecampsi',
  'rageaui',
  'brunnipes',
  'brumpti',
  'leesoni',
  'tchekedii',
  'melas',
  'coluzzii',
  'cristipalpis',
  'rodhaini',
];

export function singularOutputs(filters: VectorAtlasFilters) {
  const updatedFilters = JSON.parse(JSON.stringify(filters));
  updatedFilters.country.value = filters.country.value[0];
  updatedFilters.species.value = filters.species.value[0];
  updatedFilters.season.value = filters.season.value[0];
  updatedFilters.control.value = filters.control.value[0];
  updatedFilters.isAdult.value = filters.isAdult.value[0];
  updatedFilters.isLarval.value = filters.isLarval.value[0];
  return updatedFilters;
}

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
  map_styles: {
    layers: {
      name: string;
      colorChange: 'fill' | 'stroke';
      fillColor: number[];
      strokeColor: number[];
      strokeWidth: number;
      zIndex: number;
    }[];
  };
  map_overlays: {
    name: string;
    displayName: string;
    sourceLayer: string;
    sourceType: string;
    isVisible: boolean;
  }[];
  currentSearchID: string;
  occurrence_data: {
    items: [{}];
    total: number;
    hasMore: boolean;
  }[];
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
  species_list: { series: string; color: number[] }[];
  selectedIds: string[];
  selectedData: DetailedOccurrence[];
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
  species_list: [],
  filters: {
    country: { value: [] },
    species: { value: [] },
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
  },
  filterValues: {
    country: countryList,
    species: speciesList,
  },
  selectedIds: [],
  selectedData: [],
});

export const getMapStyles = createAsyncThunk('map/getMapStyles', async () => {
  const mapStyles = await fetchMapStyles();
  return mapStyles;
});

export const getTileServerOverlays = createAsyncThunk(
  'map/getTileServerOverlays',
  async () => {
    const tileServerOverlays = await fetchTileServerOverlays();
    return tileServerOverlays;
  }
);

export const getSpeciesList = createAsyncThunk(
  'map/getSpeciesList',
  async () => {
    const speciesList = await fetchSpeciesList();
    return speciesList.data;
  }
);

//Get occurrence results
export const getOccurrenceData = createAsyncThunk(
  'map/getOccurrenceData',
  async (filters: MapState['filters'], thunkAPI) => {
    const numberOfItemsPerResponse = 100;
    const response = await fetchGraphQlData(
      occurrenceQuery(0, numberOfItemsPerResponse, singularOutputs(filters))
    );

    var siteLocations = response.data.OccurrenceData.items;
    var hasMore = response.data.OccurrenceData.hasMore;
    var responseNumber = numberOfItemsPerResponse;

    const searchID = 'id' + Math.random().toString(16).slice(2);
    thunkAPI.dispatch(startNewSearch(searchID));
    thunkAPI.dispatch(updateOccurrence({ data: siteLocations, searchID }));
    while (hasMore === true) {
      const anotherResponse = await fetchGraphQlData(
        occurrenceQuery(
          responseNumber,
          numberOfItemsPerResponse,
          singularOutputs(filters)
        )
      );
      const moreSiteLocations = anotherResponse.data.OccurrenceData.items;
      thunkAPI.dispatch(
        updateOccurrence({
          data: [...siteLocations, ...moreSiteLocations],
          searchID,
        })
      );
      siteLocations = [...siteLocations, ...moreSiteLocations];
      hasMore = anotherResponse.data.OccurrenceData.hasMore;
      responseNumber += numberOfItemsPerResponse;
    }
  }
);

export const getFullOccurrenceData = createAsyncThunk(
  'map/getFullOccurrenceData',
  async (_, thunkAPI) => {
    const selectedIds = (thunkAPI.getState() as AppState).map.selectedIds;
    const response = await fetchGraphQlData(fullOccurrenceQuery(selectedIds));
    const data = response.data.FullOccurrenceData;
    thunkAPI.dispatch(updateSelectedData(data));
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMapStyles.fulfilled, (state, action) => {
        state.map_styles = action.payload;
      })
      .addCase(getTileServerOverlays.fulfilled, (state, action) => {
        state.map_overlays = unpackOverlays(action.payload);
      })
      .addCase(getSpeciesList.fulfilled, (state, action) => {
        state.species_list = action.payload;
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
} = mapSlice.actions;
export default mapSlice.reducer;
