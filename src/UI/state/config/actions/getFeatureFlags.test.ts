import { waitFor } from '@testing-library/react';
import * as api from '../../../api/api';
import mockStore from '../../../test_config/mockStore';
import reducer, { initialState } from '../configSlice';
import { getFeatureFlags } from './getFeatureFlags';

const mockApi = api as {
  fetchFeatureFlags: () => Promise<any>;
};

jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchFeatureFlags: jest.fn().mockResolvedValue({ flag: 'test', on: true }),
}));

describe('getFeatureFlags', () => {
  const pending = { type: getFeatureFlags.pending.type };
  const fulfilled = {
    type: getFeatureFlags.fulfilled.type,
    payload: [{ flag: 'test', on: true }],
  };
  const rejected = { type: getFeatureFlags.rejected.type };
  const { store } = mockStore({ config: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchFeatureFlags', () => {
    store.dispatch(getFeatureFlags());

    expect(api.fetchFeatureFlags).toBeCalledWith();
  });

  it('returns the fetched data', async () => {
    store.dispatch(getFeatureFlags());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    store;
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchFeatureFlags = jest
      .fn()
      .mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getFeatureFlags());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });

  it('pending action changes state', () => {
    const newState = reducer(initialState, pending);
    expect(newState.feature_flags).toEqual([]);
    expect(newState.feature_flags_status).toEqual('loading');
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.feature_flags).toEqual([{ flag: 'test', on: true }]);
    expect(newState.feature_flags_status).toEqual('success');
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.feature_flags).toEqual([]);
    expect(newState.feature_flags_status).toEqual('error');
  });
});
