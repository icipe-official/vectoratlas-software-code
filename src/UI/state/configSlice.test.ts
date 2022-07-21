import mockStore from '../test_config/mockStore';
import reducer, { getUiVersion, initialState } from './configSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';

it('returns initial state when given undefined previous state', () => {
    expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
});

describe('getUiVersion', () => {
  const pending = { type: getUiVersion.pending.type };
  const fulfilled = {
    type: getUiVersion.fulfilled.type,
    payload: "test_ui_version",
  };
  const rejected = { type: getUiVersion.rejected.type };
  const { store } = mockStore({ config: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchLocalText', () => {
    const mockFetchLocalText = jest.spyOn(api, 'fetchLocalText');

    store.dispatch(getUiVersion());

    expect(mockFetchLocalText).toBeCalledWith('version.txt');
  });

  it('returns the fetched data', async () => {
    const mockFetchLocalText = jest.spyOn(api, 'fetchLocalText');
    mockFetchLocalText.mockResolvedValue("version");
    store.dispatch(getUiVersion());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2)); // You need this if you want to see either `fulfilled` or `rejected` actions for the thunk
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
  });

  it('dispatches rejected action on bad request', async () => {
    const mockFetchLocalText = jest.spyOn(api, 'fetchLocalText');
    mockFetchLocalText.mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getUiVersion());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });
});