import { createSlice } from '@reduxjs/toolkit';

export interface ReviewState {
}

export const initialState: () => ReviewState = () => ({
});

export const reviewSlice = createSlice({
  name: 'upload',
  initialState: initialState(),
  reducers: {
  },
});

export const {  } = reviewSlice.actions;

export default reviewSlice.reducer;
