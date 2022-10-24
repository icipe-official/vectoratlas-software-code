import mockStore from '../test_config/mockStore';
import reducer, {
  getMapStyles,
  getOccurrenceData,
  getSpeciesList,
  getTileServerOverlays,
  initialState,
  updateOccurrence,
} from './mapSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';
import { occurrenceQuery } from '../api/queries';
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
    payload: [{ name: 'testOverlay', source: 'testSource' }],
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
      { name: 'testOverlay', source: 'testSource' },
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
    payload: { data: [{ species: '1' }, { species: '2' }] },
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
    expect(newState.species_list).toEqual({ data: [] });
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.species_list).toEqual({
      data: [{ species: '1' }, { species: '2' }],
    });
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.species_list).toEqual({ data: [] });
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
