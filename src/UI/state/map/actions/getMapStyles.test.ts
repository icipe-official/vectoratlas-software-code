import { waitFor } from '@testing-library/react';
import { getMapStyles } from './getMapStyles';
import * as api from '../../../api/api';
import mockStore from '../../../test_config/mockStore';
import reducer, { initialState } from '../mapSlice';

const mockApi = api as {
  fetchMapStyles: () => Promise<any>;
};

jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchMapStyles: jest.fn().mockResolvedValue({
    name: 'testStyle',
    fillColor: [0, 0, 0, 1],
    strokeColor: [255, 255, 255, 1],
    strokeWidth: 2,
    zIndex: 1,
  }),
}));

describe('getMapStyles', () => {
  let state = initialState();
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
