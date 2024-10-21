import { createSlice } from '@reduxjs/toolkit';
import { DOI } from '../state.types';

export interface DoiState {
  currentDoi: DOI | null;
  loading: boolean;
  dois: DOI[];
}

export const initialState: () => DoiState = () => ({
  currentDoi: null,
  loading: false,
  dois: [],
});

export const doiSlice = createSlice({
  name: 'dois',
  initialState: initialState(),
  reducers: {
    setCurrentDoi(state, action) {
      state.currentDoi = action.payload;
    },
    doiLoading(state, action) {
      state.loading = action.payload;
    },
    setDois(state, action) {
      state.dois = action.payload;
    },
  },
});

export const { setCurrentDoi, doiLoading, setDois } = doiSlice.actions;

export default doiSlice.reducer;
