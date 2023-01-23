import { createSlice } from '@reduxjs/toolkit';

export const initialState = () => ({
  showMore: false,
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
  },
  extraReducers: () => {},
});

export const { showMoreToggle } = homeSlice.actions;

export default homeSlice.reducer;
