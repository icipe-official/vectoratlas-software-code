import { fetchGraphQlData, fetchGraphQlDataAuthenticated } from "../api/api";
import { newSourceQuery, referenceQuery } from "../api/queries";
import { NewSource } from "../components/sources/source_form";
import { AppState } from "./store";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from "react-toastify";

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
  },
};

//Genereting pending, fulfilled and rejected action types
export const getSourceInfo = createAsyncThunk(
  'source/getSourceInfo',
  async (_, { getState }) => {
    const { page, rowsPerPage } = (getState() as AppState).source
      .source_table_options;
    const skip = page * rowsPerPage;
    const sourceInfo = await fetchGraphQlData(
      referenceQuery(skip, rowsPerPage)
    );

    return sourceInfo.data.allReferenceData;
  }
);

export const postNewSource = createAsyncThunk('source/getSourceInfo', async (source: NewSource, { getState }) => {
  const query = newSourceQuery(source);
  const token = (getState() as AppState).auth.token;
  const result = await fetchGraphQlDataAuthenticated(query, token);
  if (result.errors) {
    if (result.errors[0].message.includes('duplicate key')) {
      toast.error(`Reference with title "${source.article_title}" already exists`);
    } else {
      toast.error('Unknown error in creating new reference. Please try again.')
    }
    return false;
  } else if (result.data) {
    toast.success(`Reference created with id ${result.data.createReference.num_id}`);
    return true;
  }
})

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

export const { changeSourcePage, changeSourceRowsPerPage } =
  sourceSlice.actions;
export default sourceSlice.reducer;
