import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';
import { fetchGraphQlData } from "../api/api";
import { referenceQuery } from "../api/queries";


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
export const getSourceInfo = createAsyncThunk('source/getSourceInfo', async() => {
  const sourceInfo = await fetchGraphQlData(referenceQuery());

  return sourceInfo.data.allReferenceData;
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
    })

  },
})

export default sourceSlice.reducer;