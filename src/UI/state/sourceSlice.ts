import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGraphQlData, fetchGraphQlDataAuthenticated } from "../api/api";
import { sourceQuery, newSourceQuery } from "../api/queries";
import { NewSource } from "../components/sources/source_form";
import { AppState } from "./store";


export interface SourceState {
  source_info: {
      author: string,
      article_title:string,
      journal_title:string,
      citation: string,
      year: number,
      published:boolean,
      report_type: string,
      v_data: boolean

  }[],
  source_info_status: string,
}

export const initialState: SourceState = {
source_info: [],
source_info_status: "",

}

//Genereting pending, fulfilled and rejected action types
export const getSourceInfo = createAsyncThunk('source/getSourceInfo', async () => {
  const sourceInfo = await fetchGraphQlData(sourceQuery());

  return sourceInfo.data.allReferenceData;
})

export const postNewSource = createAsyncThunk('source/getSourceInfo', async (source: NewSource, { getState }) => {
  const query = newSourceQuery(source);
  const token = (getState() as AppState).auth.token
  const queryResponse = await fetchGraphQlDataAuthenticated(query, token);
  console.log(queryResponse);
})

export const sourceSlice = createSlice({
  name: 'source_info',
  initialState,
  reducers:{
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
    })

  },
})

export default sourceSlice.reducer;