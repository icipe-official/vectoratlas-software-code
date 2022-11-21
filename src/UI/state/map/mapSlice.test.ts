import mockStore from '../../test_config/mockStore';
import reducer, {
  getMapStyles,
  getOccurrenceData,
  getSpeciesList,
  getTileServerOverlays,
  initialState,
  updateOccurrence,
  layerToggle,
  drawerToggle,
  drawerListToggle,
  startNewSearch,
  MapState,
  filterHandler,
  updateMapLayerColour,
} from './mapSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../../api/api';

const mockApi = api as {
  fetchMapStyles: () => Promise<any>;
  fetchTileServerOverlays: () => Promise<any>;
  fetchGraphQlData: (query: string) => Promise<any>;
  fetchSpeciesList: () => Promise<any>;
};

jest.mock('../../api/queries', () => ({
  occurrenceQuery: jest.fn().mockReturnValue('test locations query'),
}));
jest.mock('../../api/api', () => ({
  __esModule: true,
  fetchMapStyles: jest.fn().mockResolvedValue({
    name: 'testStyle',
    fillColor: [0, 0, 0, 1],
    strokeColor: [255, 255, 255, 1],
    strokeWidth: 2,
    zIndex: 1,
  }),
  fetchTileServerOverlays: jest
    .fn()
    .mockResolvedValue({ name: 'testOverlay', source: 'testSource' }),
  fetchGraphQlData: jest
    .fn()
    .mockResolvedValue([{ latitude: 1, longitude: 2 }]),
  fetchSpeciesList: jest
    .fn()
    .mockResolvedValue({ data: [{ species: '1' }, { species: '2' }] }),
}));

const buildFilters = () => ({
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
});

describe('mapSlice', () => {
  let state: MapState;

  beforeEach(() => {
    state = initialState();
  });

  it('returns initial state when given undefined previous state', () => {
    expect(reducer(undefined, { type: 'nop' })).toEqual(state);
  });

  describe('getMapStyles', () => {
    const pending = { type: getMapStyles.pending.type };
    const fulfilled = {
      type: getMapStyles.fulfilled.type,
      payload: [
        {
          name: 'testStyle',
          fillColor: [0, 0, 0, 1],
          strokeColor: [255, 255, 255, 1],
          strokeWidth: 2,
          zIndex: 1,
        },
      ],
    };
    const rejected = { type: getMapStyles.rejected.type };
    const { store } = mockStore({ map: state });

    afterEach(() => {
      store.clearActions();
      jest.restoreAllMocks();
    });

    it('calls fetchApiVersion', () => {
      store.dispatch(getMapStyles());

      expect(api.fetchMapStyles).toBeCalledWith();
    });

    it('returns the fetched data', async () => {
      store.dispatch(getMapStyles());

      const actions = store.getActions();
      await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
      expect(actions[0].type).toEqual(pending.type);
      expect(actions[1].type).toEqual(fulfilled.type);
      store;
    });

    it('dispatches rejected action on bad request', async () => {
      mockApi.fetchMapStyles = jest
        .fn()
        .mockRejectedValue({ status: 400, data: 'Bad request' });
      store.dispatch(getMapStyles());

      const actions = store.getActions();
      await waitFor(() => expect(actions).toHaveLength(2));
      expect(actions[1].type).toEqual(rejected.type);
    });

    it('pending action changes state', () => {
      const newState = reducer(state, pending);
      expect(newState.map_styles).toEqual({ layers: [] });
    });

    it('fulfilled action changes state', () => {
      const newState = reducer(state, fulfilled);
      expect(newState.map_styles).toEqual([
        {
          name: 'testStyle',
          fillColor: [0, 0, 0, 1],
          strokeColor: [255, 255, 255, 1],
          strokeWidth: 2,
          zIndex: 1,
        },
      ]);
    });

    it('rejected action changes state', () => {
      const newState = reducer(state, rejected);
      expect(newState.map_styles).toEqual({ layers: [] });
    });
  });

  describe('getTileServerOverlays', () => {
    const pending = { type: getTileServerOverlays.pending.type };
    const fulfilled = {
      type: getTileServerOverlays.fulfilled.type,
      payload: [
        {
          name: 'testName',
          sourceLayer: 'overlays',
          sourceType: 'raster',
        },
        {
          name: 'world',
          sourceType: 'vector',
          overlays: [{ name: 'testOverlay1' }, { name: 'testOverlay2' }],
        },
      ],
    };
    const rejected = { type: getTileServerOverlays.rejected.type };
    const { store } = mockStore({ map: state });

    afterEach(() => {
      store.clearActions();
      jest.restoreAllMocks();
    });

    it('calls fetchApiVersion', () => {
      store.dispatch(getTileServerOverlays());

      expect(api.fetchTileServerOverlays).toBeCalledWith();
    });

    it('returns the fetched data', async () => {
      store.dispatch(getTileServerOverlays());

      const actions = store.getActions();
      await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
      expect(actions[0].type).toEqual(pending.type);
      expect(actions[1].type).toEqual(fulfilled.type);
      store;
    });

    it('dispatches rejected action on bad request', async () => {
      mockApi.fetchTileServerOverlays = jest
        .fn()
        .mockRejectedValue({ status: 400, data: 'Bad request' });
      store.dispatch(getTileServerOverlays());

      const actions = store.getActions();
      await waitFor(() => expect(actions).toHaveLength(2));
      expect(actions[1].type).toEqual(rejected.type);
    });

    it('pending action changes state', () => {
      const newState = reducer(state, pending);
      expect(newState.map_overlays).toEqual([]);
    });

    it('fulfilled action changes state', () => {
      const newState = reducer(state, fulfilled);
      expect(newState.map_overlays).toEqual([
        {
          isVisible: false,
          name: 'testName',
          sourceLayer: 'overlays',
          sourceType: 'raster',
        },
        {
          isVisible: true,
          name: 'testOverlay1',
          sourceLayer: 'world',
          sourceType: 'vector',
        },
        {
          isVisible: true,
          name: 'testOverlay2',
          sourceLayer: 'world',
          sourceType: 'vector',
        },
      ]);
    });

    it('rejected action changes state', () => {
      const newState = reducer(state, rejected);
      expect(newState.map_styles).toEqual({ layers: [] });
    });
  });

  describe('getSpeciesList', () => {
    const pending = { type: getSpeciesList.pending.type };
    const fulfilled = {
      type: getSpeciesList.fulfilled.type,
      payload: {
        data: [
          { series: '1', color: 1 },
          { series: '2', color: 2 },
        ],
      },
    };
    const rejected = { type: getSpeciesList.rejected.type };
    const { store } = mockStore({ map: state });

    afterEach(() => {
      store.clearActions();
      jest.restoreAllMocks();
    });

    it('calls fetchSpeciesList', () => {
      store.dispatch(getSpeciesList());

      expect(api.fetchSpeciesList).toBeCalledWith();
    });

    it('returns the fetched data', async () => {
      store.dispatch(getSpeciesList());

      const actions = store.getActions();
      await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
      expect(actions[0].type).toEqual(pending.type);
      expect(actions[1].type).toEqual(fulfilled.type);
      store;
    });

    it('dispatches rejected action on bad request', async () => {
      mockApi.fetchSpeciesList = jest
        .fn()
        .mockRejectedValue({ status: 400, data: 'Bad request' });
      store.dispatch(getSpeciesList());

      const actions = store.getActions();
      await waitFor(() => expect(actions).toHaveLength(2));
      expect(actions[1].type).toEqual(rejected.type);
    });

    it('pending action changes state', () => {
      const newState = reducer(state, pending);
      expect(newState.species_list).toEqual([]);
    });

    it('fulfilled action changes state', () => {
      const newState = reducer(state, fulfilled);
      expect(newState.species_list).toEqual({
        data: [
          { series: '1', color: 1 },
          { series: '2', color: 2 },
        ],
      });
    });

    it('rejected action changes state', () => {
      const newState = reducer(state, rejected);
      expect(newState.species_list).toEqual([]);
    });
  });

  describe('filterHandler', () => {
    it('updates filter with new value', () => {
      const newState = reducer(
        state,
        filterHandler({
          filterName: 'country',
          filterOptions: ['a', 'b'],
        })
      );

      expect(newState.filters.country).toEqual({ value: ['a', 'b'] });
    });
  });

  describe('updateOccurrence', () => {
    const expectedOccurrenceData = [{ test: 1 }, { test: 2 }];

    beforeEach(() => {
      state.currentSearchID = '1234';
    });

    it('startNewSearch sets a new search ID', () => {
      const newState = reducer(state, startNewSearch('890'));
      expect(newState.currentSearchID).toEqual('890');
    });

    it('updates occurrence data if the searchID matches', () => {
      const newState = reducer(
        state,
        updateOccurrence({
          data: expectedOccurrenceData,
          searchID: '1234',
        })
      );

      expect(newState.occurrence_data).toEqual(expectedOccurrenceData);
    });

    it('does not update occurrence data if the searchID does not match', () => {
      const newState = reducer(
        state,
        updateOccurrence({
          data: expectedOccurrenceData,
          searchID: '5678',
        })
      );

      expect(newState.occurrence_data).toEqual(state.occurrence_data);
    });
  });

  describe('updateMapLayerColour', () => {
    beforeEach(() => {
      state.map_styles.layers = [
        {
          name: 'test layer',
          colorChange: 'fill',
          fillColor: [255, 0, 0, 1],
          strokeColor: [],
          strokeWidth: 1,
          zIndex: 1,
        },
      ];
    });

    it('does not update any layers if the name does not match', () => {
      const newState = reducer(
        state,
        updateMapLayerColour({
          name: 'non existent layer',
          color: [0, 0, 255, 1],
        })
      );
      expect(newState.map_styles.layers).toEqual(state.map_styles.layers);
    });

    it('updates the color correctly for a fill layer', () => {
      const newState = reducer(
        state,
        updateMapLayerColour({ name: 'test layer', color: [0, 0, 255, 1] })
      );
      expect(newState.map_styles.layers[0].fillColor).toEqual([0, 0, 255, 1]);
    });

    it('updates the color correctly for a stroke layer', () => {
      state.map_styles.layers[0].colorChange = 'stroke';
      const newState = reducer(
        state,
        updateMapLayerColour({ name: 'test layer', color: [0, 0, 255, 1] })
      );
      expect(newState.map_styles.layers[0].strokeColor).toEqual([0, 0, 255, 1]);
    });
  });

  describe('getOccurrenceData', () => {
    let mockThunkAPI: any;
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);

      mockApi.fetchGraphQlData = jest.fn().mockResolvedValueOnce({
        data: {
          OccurrenceData: {
            items: [{ test: 1 }, { test: 2 }],
            total: 2,
            hasMore: false,
          },
        },
      });

      mockThunkAPI = {
        dispatch: jest.fn(),
        getState: jest.fn(),
      };
    });
    it('dispatches updateOccurrence for one page only', async () => {
      // Setup
      mockApi.fetchGraphQlData = jest.fn().mockResolvedValueOnce({
        data: {
          OccurrenceData: {
            items: [{ test: 1 }, { test: 2 }],
            total: 2,
            hasMore: false,
          },
        },
      });

      const filters = buildFilters();
      await getOccurrenceData(filters)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        startNewSearch('id1f9add3739635f')
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        updateOccurrence({
          data: [{ test: 1 }, { test: 2 }],
          searchID: 'id1f9add3739635f',
        })
      );
    });

    it('dispatches updateOccurrence multiple times for multiple pages', async () => {
      mockApi.fetchGraphQlData = jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            OccurrenceData: {
              items: [{ test: 1 }, { test: 2 }],
              total: 4,
              hasMore: true,
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            OccurrenceData: {
              items: [{ test: 3 }, { test: 4 }],
              total: 4,
              hasMore: false,
            },
          },
        });

      const filters = buildFilters();

      await getOccurrenceData(filters)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        startNewSearch('id1f9add3739635f')
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        updateOccurrence({
          data: [{ test: 1 }, { test: 2 }],
          searchID: 'id1f9add3739635f',
        })
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        updateOccurrence({
          data: [{ test: 1 }, { test: 2 }, { test: 3 }, { test: 4 }],
          searchID: 'id1f9add3739635f',
        })
      );
    });
  });
  describe('layerToggle', () => {
    beforeEach(() => {
      state.map_overlays = [
        {
          name: 'testName',
          displayName: 'testDisplay',
          sourceLayer: 'overlays',
          sourceType: 'raster',
          isVisible: false,
        },
      ];
    });

    it('toggles the visibility of a layer', () => {
      state = reducer(state, layerToggle('testName'));
      expect(
        state.map_overlays.find((l: any) => l.name === 'testName')?.isVisible
      ).toBe(true);

      state = reducer(state, layerToggle('testName'));
      expect(
        state.map_overlays.find((l: any) => l.name === 'testName')?.isVisible
      ).toBe(false);
    });

    it(' does nothing for unrecognised layers', () => {
      const newState = reducer(state, layerToggle('unknownLayer'));
      expect(newState.map_overlays).toEqual(state.map_overlays);
    });
  });

  describe('drawerToggle', () => {
    it('toggles the drawer from open to closed and vice versa', () => {
      const stateDrawerOpen = reducer(state, drawerToggle());
      expect(stateDrawerOpen.map_drawer.open).toEqual(true);

      const stateDrawerClosed = reducer(stateDrawerOpen, drawerToggle());
      expect(stateDrawerClosed.map_drawer.open).toEqual(false);
    });
    it('toggles the drawer list section as expected', () => {
      const newState = reducer(state, drawerListToggle('overlays'));
      expect(newState.map_drawer.overlays).toEqual(true);
      expect(newState.map_drawer.baseMap).not.toEqual(true);
    });
  });
});
