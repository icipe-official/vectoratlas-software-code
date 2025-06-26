import { createSlice } from '@reduxjs/toolkit';

export const initialState = () => ({
  locale: 'en',
});

export const localizationSlice = createSlice({
  name: 'localization',
  initialState: initialState(),
  reducers: {
    setLocale(state, action) {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = localizationSlice.actions;

export default localizationSlice.reducer;
