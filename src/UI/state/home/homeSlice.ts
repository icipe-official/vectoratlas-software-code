import { createSlice } from '@reduxjs/toolkit';

export const initialState = () => ({
  isMore: false,
});

export const homeSlice = createSlice({
  name: 'home',
  initialState: initialState(),
  reducers: {
    isMoreToggle(state) {
      state.isMore === true ? (state.isMore = false) : (state.isMore = true);
    },
  },
  extraReducers: () => {},
});

export const { isMoreToggle } = homeSlice.actions;

export default homeSlice.reducer;
