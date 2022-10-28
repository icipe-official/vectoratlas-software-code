import mockStore from '../test_config/mockStore';
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
} from './mapSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';

const mockApi = api as {
  fetchMapStyles: () => Promise<any>;
  fetchTileServerOverlays: () => Promise<any>;
  fetchGraphQlData: (query: string) => Promise<any>;
  fetchSpeciesList: () => Promise<any>;
};

jest.mock('../api/queries', () => ({
  occurrenceQuery: jest.fn().mockReturnValue('test locations query'),
}));
jest.mock('../api/api', () => ({
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

it('returns initial state when given undefined previous state', () => {
  expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
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
  const { store } = mockStore({ map: initialState });

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
    const newState = reducer(initialState, pending);
    expect(newState.map_styles).toEqual({ layers: [] });
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
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
    const newState = reducer(initialState, rejected);
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
  const { store } = mockStore({ map: initialState });

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
    const newState = reducer(initialState, pending);
    expect(newState.map_overlays).toEqual([]);
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.map_overlays).toEqual([
      {
        isVisible: true,
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
    const newState = reducer(initialState, rejected);
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
  const { store } = mockStore({ map: initialState });

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
    const newState = reducer(initialState, pending);
    expect(newState.species_list).toEqual([]);
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.species_list).toEqual({
      data: [
        { series: '1', color: 1 },
        { series: '2', color: 2 },
      ],
    });
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.species_list).toEqual([]);
  });
});

describe('getOccurrenceData', () => {
  let mockThunkAPI: any;
  beforeEach(() => {
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

    await getOccurrenceData()(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      updateOccurrence([{ test: 1 }, { test: 2 }])
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

    await getOccurrenceData()(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      updateOccurrence([{ test: 1 }, { test: 2 }])
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      updateOccurrence([{ test: 1 }, { test: 2 }, { test: 3 }, { test: 4 }])
    );
  });
});
describe('layerToggle', () => {
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

  it('toggles the visibility of a layer', () => {
    const initState = reducer(initialState, fulfilled);
    const toggleLayerVisible = reducer(initState, layerToggle('testName'));
    expect(
      toggleLayerVisible.map_overlays.find((l: any) => l.name === 'testName')
        ?.isVisible
    ).toEqual(false);
  });
});
describe('drawerToggle', () => {
  const { store } = mockStore({ map: initialState });
  it('toggles the drawer from open to closed and vice versa', () => {
    const stateDrawerOpen = reducer(initialState, drawerToggle());
    expect(stateDrawerOpen.map_drawer.open).toEqual(true);
    const stateDrawerClosed = reducer(stateDrawerOpen, drawerToggle());
    expect(stateDrawerClosed.map_drawer.open).toEqual(false);
  });
  it('toggles the drawer list section as expected', () => {
    const newState = reducer(initialState, drawerListToggle('overlays'));
    expect(newState.map_drawer.overlays).toEqual(true);
    expect(newState.map_drawer.baseMap).not.toEqual(true);
  });
});
