import { getUserRoles, saveUserRoles } from './admin.actions';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
} from '../../../api/api';
import { toast } from 'react-toastify';
import * as logger from '../../../utils/logger';
import { adminLoading, changeUserRoles, usersWithRoles } from '../adminSlice';

jest.mock('../../../api/api', () => ({
  fetchGraphQlDataAuthenticated: jest.fn(),
  fetchGraphQlData: jest.fn(),
}));

jest.mock('../../../utils/logger', () => ({
  error: jest.fn(),
}));

jest.mock('../../../api/queries', () => ({
  getAllUsersWithRoles: jest.fn(),
  updateUserRoles: jest.fn((r) => r),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('admin actions', () => {
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

  describe('getUserRoles', () => {
    it('queries roles from the api and dispatches usersWithRoles', async () => {
      (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
        data: {
          allUserRoles: 'user-roles-mock',
        },
      });

      await getUserRoles()(mockThunkAPI.dispatch, mockThunkAPI.getState, null);

      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(adminLoading(true));
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        usersWithRoles('user-roles-mock')
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(adminLoading(false));
    });

    it('shows a toast if there is an error', async () => {
      (fetchGraphQlDataAuthenticated as jest.Mock).mockRejectedValue(
        'test error'
      );

      await getUserRoles()(mockThunkAPI.dispatch, mockThunkAPI.getState, null);

      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(adminLoading(true));
      expect(toast.error).toHaveBeenCalledWith('Unable to get user roles');
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(adminLoading(false));
    });
  });

  describe('saveUserRoles', () => {
    it('sends user role mutation to the API and updates roles in local state', async () => {
      (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
        data: {
          updateUserRoles: 'user-roles-mock',
        },
      });

      await saveUserRoles({ auth0_id: '123' } as any)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(fetchGraphQlDataAuthenticated).toHaveBeenCalledWith(
        { auth0_id: '123' },
        'token12345'
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        changeUserRoles('user-roles-mock')
      );
    });

    it('shows a toast if unable to update roles', async () => {
      (fetchGraphQlDataAuthenticated as jest.Mock).mockRejectedValue(
        'test error'
      );

      await saveUserRoles({ auth0_id: '123' } as any)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(toast.error).toHaveBeenCalledWith('Unable to update user roles');
    });
  });
});
