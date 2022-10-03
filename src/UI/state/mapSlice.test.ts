import mockStore from '../test_config/mockStore';
import reducer, { getMapStyles, getTileServerOverlays, initialState } from './mapSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';

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
    const mockFetchApiJson = jest.spyOn(api, 'fetchApiJson');

    store.dispatch(getMapStyles());

    expect(mockFetchApiJson).toBeCalledWith('config/map-styles');
  });

  it('returns the fetched data', async () => {
    const mockFetchApiJson = jest.spyOn(api, 'fetchApiJson');
    mockFetchApiJson.mockResolvedValue({ name:'testStyle', fillColor:[0,0,0,1], strokeColor:[255,255,255,1], strokeWidth: 2, zIndex: 1  });
    store.dispatch(getMapStyles());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    store;
  });

  it('dispatches rejected action on bad request', async () => {
    const mockFetchApiJson = jest.spyOn(api, 'fetchApiJson');
    mockFetchApiJson.mockRejectedValue({ status: 400, data: 'Bad request' });
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
    const mockFetchApiJson = jest.spyOn(api, 'fetchApiJson');

    store.dispatch(getTileServerOverlays());

    expect(mockFetchApiJson).toBeCalledWith('config/tile-server-overlays');
  });

  it('returns the fetched data', async () => {
    const mockFetchApiJson = jest.spyOn(api, 'fetchApiJson');
    mockFetchApiJson.mockResolvedValue({ name:'testOverlay', source:'testSource' });
    store.dispatch(getTileServerOverlays());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    store;
  });

  it('dispatches rejected action on bad request', async () => {
    const mockFetchApiJson = jest.spyOn(api, 'fetchApiJson');
    mockFetchApiJson.mockRejectedValue({ status: 400, data: 'Bad request' });
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
