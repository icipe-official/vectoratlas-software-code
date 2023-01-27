import { createSlice } from '@reduxjs/toolkit';

export const initialState = () => ({
  showMore: false,
  stats: {
    pageViews: 0,
    countries: 0,
    uniqueViews: 0,
    events: 0
  }
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
  },
  extraReducers: () => {},
});

export const { showMoreToggle, updateStats } = homeSlice.actions;

export default homeSlice.reducer;
