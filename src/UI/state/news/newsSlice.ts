import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { News } from '../state.types';

export interface NewsState {
  currentNewsForEditing: News | null;
  loading: boolean;
  news: News[];
  topNews: News[];
}

export const initialState: () => NewsState = () => ({
  currentNewsForEditing: null,
  loading: false,
  news: [],
  topNews: [],
});

export const newsSlice = createSlice({
  name: 'news',
  initialState: initialState(),
  reducers: {
    setCurrentNewsForEditing(state, action) {
      state.currentNewsForEditing = action.payload;
    },
    newsLoading(state, action) {
      state.loading = action.payload;
    },
    setNewsItems(state, action) {
      state.news = action.payload;
    },
    setTopNewsItems(state, action) {
      state.topNews = action.payload;
    },
    clearCurrentNewsItem (state,action: PayloadAction<void>) {
      state.currentNewsForEditing = null;
    }
  },
  extraReducers: () => {},
});

export const {
  setCurrentNewsForEditing,
  newsLoading,
  setNewsItems,
  setTopNewsItems,
  clearCurrentNewsItem,
} = newsSlice.actions;

export default newsSlice.reducer;
