import { fetchGraphQlData, fetchGraphQlDataAuthenticated } from '../api/api';
import { newSourceQuery, referenceQuery } from '../api/queries';
import { NewSource } from '../components/sources/source_form';
import { AppState } from './store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Source {
  author: string;
  article_title: string;
  journal_title: string;
  citation: string;
  year: number;
  published: boolean;
  report_type: string;
  v_data: boolean;
  num_id: number;
}

export interface SourceState {
  source_info: {
    items: Source[];
    total: number;
  };
  source_info_status: string;
  source_table_options: {
    page: number;
    rowsPerPage: number;
    orderBy: string;
    order: 'asc' | 'desc';
  };
}

export const initialState: SourceState = {
  source_info: {
    items: [],
    total: 0,
  },
  source_info_status: '',
  source_table_options: {
    page: 0,
    rowsPerPage: 10,
    orderBy: 'num_id',
    order: 'asc',
  },
};

//Genereting pending, fulfilled and rejected action types
export const getSourceInfo = createAsyncThunk(
  'source/getSourceInfo',
  async (_, { getState }) => {
    const { page, rowsPerPage, orderBy, order } = (getState() as AppState)
      .source.source_table_options;
    const skip = page * rowsPerPage;
    const sourceInfo = await fetchGraphQlData(
      referenceQuery(skip, rowsPerPage, orderBy, order.toLocaleUpperCase())
    );

    return sourceInfo.data.allReferenceData;
  }
);

export const postNewSource = createAsyncThunk(
  'source/getSourceInfo',
  async (source: NewSource, { getState }) => {
    const query = newSourceQuery(source);
    const token = (getState() as AppState).auth.token;
    await fetchGraphQlDataAuthenticated(query, token);
  }
);

export const sourceSlice = createSlice({
  name: 'source_info',
  initialState,
  reducers: {
    changeSourcePage(state, action: PayloadAction<number>) {
      state.source_table_options.page = action.payload;
    },
    changeSourceRowsPerPage(state, action: PayloadAction<number>) {
      state.source_table_options.rowsPerPage = action.payload;
    },
    changeSort(state, action: PayloadAction<string>) {
      const isAsc =
        state.source_table_options.orderBy === action.payload &&
        state.source_table_options.order === 'asc';
      state.source_table_options.order = isAsc ? 'desc' : 'asc';
      state.source_table_options.orderBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSourceInfo.pending, (state) => {
        state.source_info_status = 'loading';
      })
      .addCase(getSourceInfo.rejected, (state, action) => {
        state.source_info_status = 'error';
      })
      .addCase(getSourceInfo.fulfilled, (state, action) => {
        state.source_info = action.payload;
        state.source_info_status = 'success';
      });
  },
});

export const { changeSourcePage, changeSourceRowsPerPage, changeSort } =
  sourceSlice.actions;
export default sourceSlice.reducer;
