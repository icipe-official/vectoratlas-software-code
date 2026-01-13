import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchGraphQlDataAuthenticated } from '../../../api/api';
import {
  disableNotificationsMutation,
  roleRequestMutation,
} from '../../../api/queries';
import { AppState } from '../../store';
import { requestLoading } from '../authSlice';
import { getTranslation } from '../../../utils/localization';

export const requestRoles = createAsyncThunk(
  'auth/requestRoles',
  async (
    {
      requestReason,
      rolesRequested,
      email,
    }: { requestReason: string; rolesRequested: string[]; email: string },
    { getState, dispatch },
  ) => {
    try {
      dispatch(requestLoading(true));
      const token = (getState() as AppState).auth.token;

      const roleRequest = await fetchGraphQlDataAuthenticated(
        roleRequestMutation(requestReason, rolesRequested, email),
        token,
      );
      if (roleRequest) {
        toast.success(
          await getTranslation('ReduxActions.Auth.roleRequestSuccess'),
          //'Role request submitted.'
        );
        dispatch(requestLoading(false));
        return true;
      }
    } catch {
      toast.error(
        await getTranslation('ReduxActions.Auth.errors.roleRequestError'),
        //'Something went wrong with the role request. Please try again.'
      );
      dispatch(requestLoading(false));
      return false;
    }
  },
);

export const disableNotifications = createAsyncThunk(
  'auth/disableNotifications',
  async (
    { userId, disable }: { userId: string; disable: boolean },
    { getState, dispatch },
  ) => {
    try {
      dispatch(requestLoading(true));
      const token = (getState() as AppState).auth.token;
      const roleRequest = await fetchGraphQlDataAuthenticated(
        disableNotificationsMutation(userId, disable),
        token,
      );
      if (roleRequest) {
        toast.success(
          disable
            ? await getTranslation(
                'ReduxActions.Auth.notificationDisabledSuccess',
              )
            : await getTranslation(
                'ReduxActions.Auth.notificationEnabledSuccess',
              ),
          //`Notifications ${disable === true ? 'disabled' : 'enabled'}.`
        );
        dispatch(requestLoading(false));
        return true;
      }
    } catch {
      toast.error(
        disable
          ? await getTranslation(
              'ReduxActions.Auth.errors.notificationDisablerror',
            )
          : await getTranslation(
              'ReduxActions.Auth.errors.notificationEnablerror',
            ),
        // `Something went wrong when ${
        //   disable ? 'disabling' : 'enabling'
        // }. notification. Please try again.`
      );
      dispatch(requestLoading(false));
      return false;
    }
  },
);
