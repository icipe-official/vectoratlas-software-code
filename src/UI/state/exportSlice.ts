// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { fetchApiJson } from '../api/api';

// export const getAll = createAsyncThunk('export/getAllOccurrenceData', async () => {
//     const allOccurrenceData = await fetchApiJson('export/stream-all-file');
//     return allOccurrenceData;
//   }
// );

// export const initialState: any = []

// export const mapSlice = createSlice({
//   name: 'map',
//   initialState
//   reducers: {}
    
//   extraReducers: (builder) => {
//     builder
//       .addCase(getMapStyles.fulfilled, (state, action) => {
//         state.map_styles = action.payload;
//       })
//       .addCase(getTileServerOverlays.fulfilled, (state, action) => {
//         state.map_overlays = action.payload;
//       });

//   },
// });

// export const {
  
// } = mapSlice.actions;

// export default mapSlice.reducer;
