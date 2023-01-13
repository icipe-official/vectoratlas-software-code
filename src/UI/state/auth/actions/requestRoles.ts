import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { fetchAuth, fetchGraphQlDataAuthenticated } from "../../../api/api";
import { roleRequestMutation } from "../../../api/queries";
import { AppState } from "../../store";


export const requestRoles = createAsyncThunk('auth/getUserInfo', async ({requestReason, rolesRequested}: {requestReason: string, rolesRequested: string[]}, { getState, dispatch } ) => {
  try {
    const token = (getState() as AppState).auth.token;

    const roleRequest = await fetchGraphQlDataAuthenticated(
      roleRequestMutation(requestReason, rolesRequested),
      token
    );
    console.log(roleRequest);
  } catch {
    toast.error("Something went wrong with the role request. Please try again.")
  }
});
