import { createSlice } from '@reduxjs/toolkit';
import { updateUserRoles } from '../../api/queries';
import { UsersWithRoles } from '../state.types';

export interface AdminState {
  users: UsersWithRoles[];
  loading: boolean;
  savingUser: boolean;
}

export const initialState: () => AdminState = () => ({
  users: [],
  loading: false,
  savingUser: false
});

export const adminSlice = createSlice({
  name: 'news',
  initialState: initialState(),
  reducers: {
    usersWithRoles(state, action) {
      state.users = action.payload;
    },
    adminLoading(state, action) {
      state.loading = action.payload;
    },
    savingRoles(state, action) {
      state.savingUser = action.payload;
    },
    changeUserRoles(state, action) {
      const matchingUser = state.users.find(u => u.auth0_id === action.payload.auth0_id);
      if (matchingUser) {
        matchingUser.is_admin = action.payload.is_admin;
        matchingUser.is_uploader = action.payload.is_uploader;
        matchingUser.is_reviewer = action.payload.is_reviewer;
        matchingUser.is_editor = action.payload.is_editor;
      }
    }
  },
  extraReducers: () => {},
});

export const {
  usersWithRoles,
  adminLoading,
  savingRoles,
  changeUserRoles
} = adminSlice.actions;

export default adminSlice.reducer;
