import { createSlice } from '@reduxjs/toolkit';

export const initialState = () => ({
  showMore: false,
  serverUp: true,
  stats: {
    pageViews: 0,
    countries: 0,
    uniqueViews: 0,
    eventDownload: 0,
    recordsTotal: 0,
  },
});

export const homeSlice = createSlice({
  name: 'home',
  initialState: initialState(),
  reducers: {
    showMoreToggle(state) {
      state.showMore === true
        ? (state.showMore = false)
        : (state.showMore = true);
    },
    updateStats(state, action) {
      state.stats = action.payload;
    },
    serverValidation(state, action) {
      state.serverUp = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { showMoreToggle, updateStats, serverValidation } = homeSlice.actions;

export default homeSlice.reducer;
