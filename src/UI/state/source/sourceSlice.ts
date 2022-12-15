import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterSort } from '../state.types';
import { getSourceInfo } from './actions/getSourceInfo';

export interface Source {
  [index: string]: any;
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
  source_table_options: FilterSort;
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
    startId: 0,
    endId: null,
    textFilter: '',
  },
};

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
    changeFilterId(
      state,
      action: PayloadAction<{ startId: number | null; endId: number | null }>
    ) {
      state.source_table_options.startId = action.payload.startId;
      state.source_table_options.endId = action.payload.endId;
    },
    changeFilterText(state, action: PayloadAction<string>) {
      state.source_table_options.textFilter = action.payload;
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

export const {
  changeSourcePage,
  changeSourceRowsPerPage,
  changeSort,
  changeFilterId,
  changeFilterText,
} = sourceSlice.actions;
export default sourceSlice.reducer;
