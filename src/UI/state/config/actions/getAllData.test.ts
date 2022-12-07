import { waitFor } from '@testing-library/react';
import * as api from '../../../api/api';
import mockStore from '../../../test_config/mockStore';
import reducer, { initialState } from '../configSlice';
import { getAllData } from './getAllData';

const mockApi = api as {
  fetchAllData: () => Promise<any>;
};

jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchAllData: jest.fn().mockResolvedValue({ testAllData: 'mock all data' }),
}));

describe('getAllData', () => {
  const pending = { type: getAllData.pending.type };
  const fulfilled = {
    type: getAllData.fulfilled.type,
    payload: [{ testAllData: 'mock all data' }],
  };
  const rejected = { type: getAllData.rejected.type };
  const { store } = mockStore({ config: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchFeatureFlags', () => {
    store.dispatch(getAllData());

    expect(api.fetchAllData).toBeCalled;
  });

  it('returns the fetched data', async () => {
    store.dispatch(getAllData());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    store;
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchAllData = jest
      .fn()
      .mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getAllData());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.download_all_status).toEqual('success');
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.download_all_status).toEqual('error');
  });
});
