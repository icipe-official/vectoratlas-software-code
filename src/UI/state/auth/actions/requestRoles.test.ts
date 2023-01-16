import { waitFor } from '@testing-library/react';
import mockStore from '../../../test_config/mockStore';
import * as api from '../../../api/api';
import { initialState } from '../authSlice';
import { requestRoles } from './requestRoles';
import { toast } from 'react-toastify';
import { fetchGraphQlDataAuthenticated } from '../../../api/api';

jest.mock('../../../api/api', () => ({
  fetchGraphQlDataAuthenticated: jest.fn().mockResolvedValue(true),
  fetchGraphQlData: jest.fn(),
}));

jest.mock('../../../api/queries', () => ({
  roleRequestMutation: jest.fn((requestReason, rolesRequested, email) => 'requestReason: ' + requestReason + ', roles: ' + rolesRequested + ', email: ' + email),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('requestRoles', () => {
  let mockThunkAPI: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };

    mockThunkAPI.getState.mockReturnValue({
      auth: {
        token: 'token12345',
      },
    });
  });

  it('calls fetchGraphQlDataAuthenticated', async () => {
    await requestRoles({requestReason: 'Reason', rolesRequested: ['admin'], email: 'test@test'})(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );;

    expect(api.fetchGraphQlDataAuthenticated).toBeCalledWith("requestReason: Reason, roles: admin, email: test@test", "token12345");
  });

  it('dispatches toast and action on success', async () => {
    await requestRoles({requestReason: 'Reason', rolesRequested: ['admin'], email: 'test@test'})(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );;

    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({"payload": true, "type": "auth/requestLoading"});
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({"payload": false, "type": "auth/requestLoading"});
    expect(toast.success).toHaveBeenCalledWith(
      'Role request submitted.'
    );
  });

  it('dispatches toast and action on failure', async () => {
    (fetchGraphQlDataAuthenticated as jest.Mock).mockRejectedValue(
      new Error('test upsert fail')
    );
    await requestRoles({requestReason: 'Reason', rolesRequested: ['admin'], email: 'test@test'})(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );;

    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({"payload": true, "type": "auth/requestLoading"});
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({"payload": false, "type": "auth/requestLoading"});
    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong with the role request. Please try again."
    );
  });
});
