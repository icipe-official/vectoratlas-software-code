import mockStore from '../test_config/mockStore';
import reducer, { getUserInfo, initialState } from './authSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';
const mockApi = api as {
  fetchAuth: () => Promise<any>;
};

jest.mock('../api/api', () => ({
  __esModule: true,
  fetchAuth: jest.fn().mockResolvedValue('token123'),
}));

jest.mock('njwt', () => ({
  verify: jest.fn().mockReturnValue({
    body: { scope: 'admin,test' },
  }),
}));

it('returns initial state when given undefined previous state', () => {
  expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
});

describe('getUserInfo', () => {
  const pending = { type: getUserInfo.pending.type };
  const fulfilled = {
    type: getUserInfo.fulfilled.type,
    payload: 'test_ui_version',
  };
  const rejected = { type: getUserInfo.rejected.type };
  const { store } = mockStore({ auth: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchLocalVersion', () => {
    store.dispatch(getUserInfo());

    expect(api.fetchAuth).toBeCalledWith();
  });

  it('returns the fetched data', async () => {
    store.dispatch(getUserInfo());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    expect(actions[1].payload).toEqual({
      roles: ['admin', 'test'],
      token: 'token123',
    });
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchAuth = jest
      .fn()
      .mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getUserInfo());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });
});
