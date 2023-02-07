import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminLoading, changeUserRoles, savingRoles, usersWithRoles } from "../adminSlice";
import * as logger from '../../../utils/logger';
import { toast } from 'react-toastify';
import { AppState } from "../../store";
import { fetchGraphQlDataAuthenticated } from "../../../api/api";
import { getAllUsersWithRoles, updateUserRoles } from "../../../api/queries";
import { UsersWithRoles } from "../../state.types";

export const getUserRoles = createAsyncThunk(
  'admin/userRoles',
  async (_, { getState, dispatch }) => {
    dispatch(adminLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const users = await fetchGraphQlDataAuthenticated(
        getAllUsersWithRoles(),
        token
      );
      console.log(users.data.allUserRoles)
      dispatch(usersWithRoles(users.data.allUserRoles));

    } catch (e) {
      logger.error(e);
      toast.error('Unable to get user roles');
    }
    dispatch(adminLoading(false));
  }
);

export const saveUserRoles = createAsyncThunk(
  'admin/updateUserRoles',
  async (newUserRoles: UsersWithRoles, { getState, dispatch }) => {
    dispatch(savingRoles(true));
    try {
      const token = (getState() as AppState).auth.token;
      const updatedUser = await fetchGraphQlDataAuthenticated(
        updateUserRoles(newUserRoles),
        token
      );
      console.log(updatedUser.data.updateUserRoles);
      dispatch(changeUserRoles(updatedUser.data.updateUserRoles))

    } catch (e) {
      logger.error(e);
      toast.error('Unable to update user roles');
    }
    dispatch(savingRoles(false));
  }
);