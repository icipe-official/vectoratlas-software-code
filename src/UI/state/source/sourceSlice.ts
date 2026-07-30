import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterSort } from '../state.types';
import { getSourceInfo } from './actions/getSourceInfo';
import { deleteSource } from './actions/deleteSource';
import { getSourceById } from './actions/getSourceById';

export interface Source {
  [index: string]: any;
  author: string;
  article_title: string;
  journal_title: string;
  citation: string;
  year: number;
  report_type: string;
}

export interface SourceState {
  source_info: {
    items: Source[];
    total: number;
  };
  source_info_status: string;
  source_delete_status: string;
  source_edit: Source | null;
  source_edit_status: string;
  source_table_options: FilterSort;
}

export const initialState: SourceState = {
  source_info: {
    items: [],
    total: 0,
  },
  source_info_status: '',
  source_delete_status: '',
  source_edit: null,
  source_edit_status: '',
  source_table_options: {
    page: 0,
    rowsPerPage: 10,
    orderBy: 'id',
    order: 'asc',
    startId: 0,
    endId: null,
    textFilter: '',
    // Which column the text filter searches against. Defaults to the
    // previous hardcoded behavior (article_title) so nothing breaks for
    // anyone not yet using the new field-picker dropdown.
    filterField: 'article_title',
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
    changeFilterField(state, action: PayloadAction<string>) {
      state.source_table_options.filterField = action.payload;
    },
    clearSourceEdit(state) {
      state.source_edit = null;
      state.source_edit_status = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSourceInfo.pending, (state) => {
        state.source_info_status = 'loading';
      })
      .addCase(getSourceInfo.rejected, (state) => {
        state.source_info_status = 'error';
      })
      .addCase(getSourceInfo.fulfilled, (state, action) => {
        state.source_info = action.payload;
        state.source_info_status = 'success';
      })
      .addCase(deleteSource.pending, (state) => {
        state.source_delete_status = 'loading';
      })
      .addCase(deleteSource.rejected, (state) => {
        state.source_delete_status = 'error';
      })
      .addCase(deleteSource.fulfilled, (state, action) => {
        state.source_delete_status = action.payload ? 'success' : 'error';
      })
      .addCase(getSourceById.pending, (state) => {
        state.source_edit_status = 'loading';
      })
      .addCase(getSourceById.rejected, (state) => {
        state.source_edit_status = 'error';
      })
      .addCase(getSourceById.fulfilled, (state, action) => {
        state.source_edit = action.payload;
        state.source_edit_status = action.payload ? 'success' : 'error';
      });
  },
});

export const {
  changeSourcePage,
  changeSourceRowsPerPage,
  changeSort,
  changeFilterId,
  changeFilterText,
  changeFilterField,
  clearSourceEdit,
} = sourceSlice.actions;
export default sourceSlice.reducer;