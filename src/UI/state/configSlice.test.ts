import mockStore from '../test_config/mockStore';
import reducer, {
  getApiVersion,
  getFeatureFlags,
  getUiVersion,
  initialState,
  getAllData,
} from './configSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';
const mockApi = api as {
  fetchLocalVersion: () => Promise<any>;
  fetchApiVersion: () => Promise<any>;
  fetchFeatureFlags: () => Promise<any>;
  fetchAllData: () => Promise<any>;
};

jest.mock('../api/api', () => ({
  __esModule: true,
  fetchLocalVersion: jest.fn().mockResolvedValue('version'),
  fetchApiVersion: jest.fn().mockResolvedValue('version'),
  fetchFeatureFlags: jest.fn().mockResolvedValue({ flag: 'test', on: true }),
}));

it('returns initial state when given undefined previous state', () => {
  expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
});

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

  it('pending action changes state', () => {
    const newState = reducer(initialState, pending);
    expect(newState.download_all_status).toEqual('loading');
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
