import { waitFor } from '@testing-library/react';
import * as api from '../../../api/api';
import mockStore from '../../../test_config/mockStore';
import reducer, { initialState } from '../configSlice';
import { getApiVersion } from './getApiVersion';

const mockApi = api as {
  fetchApiVersion: () => Promise<any>;
};

jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchApiVersion: jest.fn().mockResolvedValue('version'),
}));

describe('getApiVersion', () => {
  const pending = { type: getApiVersion.pending.type };
  const fulfilled = {
    type: getApiVersion.fulfilled.type,
    payload: 'test_api_version',
  };
  const rejected = { type: getApiVersion.rejected.type };
  const { store } = mockStore({ config: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchApiVersion', () => {
    store.dispatch(getApiVersion());

    expect(api.fetchApiVersion).toBeCalledWith();
  });

  it('returns the fetched data', async () => {
    store.dispatch(getApiVersion());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchApiVersion = jest
      .fn()
      .mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getApiVersion());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });

  it('pending action changes state', () => {
    const newState = reducer(initialState, pending);
    expect(newState.version_api).toEqual('loading');
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.version_api).toEqual('test_api_version');
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.version_api).toEqual('error');
  });
});
