import mockStore from '../test_config/mockStore';
import reducer, { getMapStyles, getSiteLocations, getTileServerOverlays, initialState } from './mapSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';
const mockApi = api as {
  fetchMapStyles: () => Promise<any>,
  fetchTileServerOverlays: () => Promise<any>,
  fetchGraphQlData: (query: string) => Promise<any>,
}

jest.mock('../api/api', () => ({
  __esModule: true,
  fetchMapStyles: jest.fn().mockResolvedValue({ name:'testStyle', fillColor:[0,0,0,1], strokeColor:[255,255,255,1], strokeWidth: 2, zIndex: 1  }),
  fetchTileServerOverlays: jest.fn().mockResolvedValue({ name:'testOverlay', source:'testSource' }),
  fetchGraphQlData: jest.fn().mockResolvedValue([{ latitude: 1, longitude: 2 }]),
}));

it('returns initial state when given undefined previous state', () => {
  expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
});

describe('getMapStyles', () => {
  const pending = { type: getMapStyles.pending.type };
  const fulfilled = {
    type: getMapStyles.fulfilled.type,
    payload: [{ name:'testStyle', fillColor:[0,0,0,1], strokeColor:[255,255,255,1], strokeWidth: 2, zIndex: 1  }],
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
    mockApi.fetchMapStyles = jest.fn().mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getMapStyles());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });

  it('pending action changes state', () => {
    const newState = reducer(initialState, pending);
    expect(newState. map_styles).toEqual({layers:[]});
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.map_styles).toEqual([{ name:'testStyle', fillColor:[0,0,0,1], strokeColor:[255,255,255,1], strokeWidth: 2, zIndex: 1  }]);
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.map_styles).toEqual({layers:[]});
  });
});

describe('getTileServerOverlays', () => {
  const pending = { type: getTileServerOverlays.pending.type };
  const fulfilled = {
    type: getTileServerOverlays.fulfilled.type,
    payload: [{ name:'testOverlay', source:'testSource' }],
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
    mockApi.fetchTileServerOverlays = jest.fn().mockRejectedValue({ status: 400, data: 'Bad request' });
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
    expect(newState.map_overlays).toEqual([{ name:'testOverlay', source:'testSource' }]);
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.map_styles).toEqual({layers:[]});
  });
});

describe('getSiteLocations', () => {
  const pending = { type: getSiteLocations.pending.type };
  const fulfilled = {
    type: getSiteLocations.fulfilled.type,
    payload: [{ latitude: 1, longitude: 2 }],
  };
  const rejected = { type: getSiteLocations.rejected.type };
  const { store } = mockStore({ map: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchGraphQlData', () => {
    store.dispatch(getSiteLocations());

    expect(api.fetchGraphQlData).toBeCalledWith(`query Occurrence {
  allGeoData { year_start, site { name, location } }
}`
    );
  });

  it('returns the fetched data', async () => {
    store.dispatch(getSiteLocations());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    store;
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchGraphQlData = jest.fn().mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getSiteLocations());

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
    expect(newState.site_locations).toEqual([{ latitude: 1, longitude: 2 }]);
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.map_styles).toEqual({layers:[]});
  });
});
