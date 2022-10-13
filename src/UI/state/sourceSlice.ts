import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchApiJson } from "../api/api";
import axios from 'axios';


export const initialState = {
  loading: false,
  references: [],
  error:'',
}

//Genereting pending, fulfilled and rejected action types
export const getSourceInfo = createAsyncThunk('source/getSourceInfo',() => {
  return axios
        .get('http://localhost:3001/graphql')
        .then((response) => response.data)
})

export const sourceSlice = createSlice({
  name: 'reference',
  initialState,
  reducers:{
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSourceInfo.pending, (state) => {
        state.loading = true
      })

  builder.addCase(getSourceInfo.fulfilled, (state, action) => {
    state.loading = false
    state.references = action.payload
    state.error = ''
  })

  builder.addCase(getSourceInfo.rejected, (state, action) => {
    state.loading = false
    state.references = []
    state.error = action.error.message!
  })

  },
})



/* export interface SourceState {
    reference: {
        author: string,
        article_title:string,
        journal_title:string,
        citation: string,
        year: number,
        published:boolean;
        report_type: string,
        v_data: boolean
    }
  }
  
  export const initialState: SourceState = {
    reference: {
        author: "",
        article_title:"",
        journal_title:"",
        citation: "",
        year: 0,
        published: true,
        report_type: "",
        v_data: true
    }
} */

/* export const getSourceInfo = createAsyncThunk(
    'source/getSourceInfo',
    async () => {
      const token = await fetchApiJson('source');
      return {
        token: token
      };
    }
  ); */
  


export default sourceSlice.reducer;