import mockStore from '../test_config/mockStore';
import reducer, {
  getMapStyles,
  getOccurrenceData,
  getTileServerOverlays,
  initialState,
  updateOccurrence,
} from './mapSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';
const mockApi = api as {
  fetchMapStyles: () => Promise<any>;
  fetchTileServerOverlays: () => Promise<any>;
  fetchGraphQlData: (query: string) => Promise<any>;
};

jest.mock('../api/queries', () => ({
  locationsQuery: jest.fn().mockReturnValue('test locations query'),
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

describe('getOccurrenceData', () => {
  const pending = { type: getOccurrenceData.pending.type };
  const fulfilled = {
    type: getOccurrenceData.fulfilled.type,
    payload: [
      [
        {
          year_start: 19,
          site: {
            location: {
              type: 'Point',
              coordinates: [35.96546465, 2.85345],
            },
          },
          sample: {
            n_all: 82,
          },
        },
        {
          year_start: 227,
          site: {
            location: {
              type: 'Point',
              coordinates: [38.81845929, 2.67319336],
            },
          },
          sample: {
            n_all: 242,
          },
        },
        {
          year_start: 12,
          site: {
            location: {
              type: 'Point',
              coordinates: [34.5343535, 2.453225],
            },
          },
          sample: {
            n_all: 68,
          },
        },
        {
          year_start: 27,
          site: {
            location: {
              type: 'Point',
              coordinates: [33.4571316, 2.365873924],
            },
          },
          sample: {
            n_all: 42,
          },
        },
      ],
    ],
  };
  const rejected = { type: getOccurrenceData.rejected.type };
  const { store } = mockStore({ map: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchGraphQlData', () => {
    store.dispatch(getOccurrenceData());

    expect(api.fetchGraphQlData).toBeCalledWith('test locations query');
  });

  it('returns the fetched data', async () => {
    store.dispatch(getOccurrenceData());

    const actions = store.getActions();
    console.log(actions);
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    store;
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchGraphQlData = jest
      .fn()
      .mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getOccurrenceData());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });

  it('pending action changes state', () => {
    const newState = reducer(initialState, pending);
    expect(newState.occurrence_data).toEqual([]);
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, updateOccurrence);
    expect(newState.occurrence_data).toEqual([fulfilled.payload]);
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.occurrence_data).toEqual([]);
  });
});
