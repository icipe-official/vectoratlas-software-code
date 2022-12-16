import { waitFor } from '@testing-library/react';
import * as api from '../../../api/api';
import mockStore from '../../../test_config/mockStore';
import reducer, { initialState } from '../configSlice';
import { getUiVersion } from './getUiVersion';

const mockApi = api as {
  fetchLocalVersion: () => Promise<any>;
  fetchApiVersion: () => Promise<any>;
  fetchFeatureFlags: () => Promise<any>;
  fetchAllData: () => Promise<any>;
};

jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchLocalVersion: jest.fn().mockResolvedValue('version'),
}));

describe('getUiVersion', () => {
  const pending = { type: getUiVersion.pending.type };
  const fulfilled = {
    type: getUiVersion.fulfilled.type,
    payload: 'test_ui_version',
  };
  const rejected = { type: getUiVersion.rejected.type };
  const { store } = mockStore({ config: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchLocalVersion', () => {
    store.dispatch(getUiVersion());

    expect(api.fetchLocalVersion).toBeCalledWith();
  });

  it('returns the fetched data', async () => {
    store.dispatch(getUiVersion());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchLocalVersion = jest
      .fn()
      .mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getUiVersion());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });

  it('pending action changes state', () => {
    const newState = reducer(initialState, pending);
    expect(newState.version_ui).toEqual('loading');
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.version_ui).toEqual('test_ui_version');
  });

  it('rejected action changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.version_ui).toEqual('error');
  });
});
