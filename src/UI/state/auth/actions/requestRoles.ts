import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { fetchGraphQlDataAuthenticated } from "../../../api/api";
import { roleRequestMutation } from "../../../api/queries";
import { AppState } from "../../store";
import { requestLoading } from "../authSlice";

export const requestRoles = createAsyncThunk('auth/requestRoles', async ({requestReason, rolesRequested}: {requestReason: string, rolesRequested: string[]}, { getState, dispatch } ) => {
  try {
    dispatch(requestLoading(true));
    const token = (getState() as AppState).auth.token;

    const roleRequest = await fetchGraphQlDataAuthenticated(
      roleRequestMutation(requestReason, rolesRequested),
      token
    );
    if (roleRequest) {
      toast.success("Role request submitted.")
      dispatch(requestLoading(false));
    }
  } catch {
    toast.error("Something went wrong with the role request. Please try again.")
    dispatch(requestLoading(false));
  }
});
