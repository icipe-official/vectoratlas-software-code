import { getTileServerOverlays } from './getTileServerOverlays';
import * as api from '../../../api/api';
import reducer, { initialState } from '../mapSlice';
import mockStore from '../../../test_config/mockStore';
import { waitFor } from '@testing-library/react';

const mockApi = api as {
  fetchTileServerOverlays: () => Promise<any>;
};

jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchTileServerOverlays: jest
    .fn()
    .mockResolvedValue({ name: 'testOverlay', source: 'testSource' }),
}));

describe('getTileServerOverlays', () => {
  let state = initialState();
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
    expect(newState.map_styles).toEqual({ layers: [], scales: [] });
  });
});
