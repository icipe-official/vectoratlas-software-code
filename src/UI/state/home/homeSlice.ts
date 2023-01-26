import { createSlice } from '@reduxjs/toolkit';

export const initialState = () => ({
  showMore: false,
  events: 0,
  metrics: 0,
  pageViews: 0
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
    updateEvents(state, action) {
      state.events = action.payload;
    },
    updateMetrics(state, action) {
      state.metrics = action.payload;
    },
    updatePageViews(state, action) {
      state.pageViews = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { showMoreToggle, updateEvents, updateMetrics, updatePageViews } = homeSlice.actions;

export default homeSlice.reducer;
