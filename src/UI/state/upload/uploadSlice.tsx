import { createSlice } from '@reduxjs/toolkit';
import { error } from 'console';
import { act } from 'react-dom/test-utils';

export type ErrorRow = {
  row: number;
  data: {
    key: string;
    errorType: string;
    expectedType?: string;
    receivedType?: string;
  }[];
};

export interface UploadState {
  modelFile: File | null;
  dataFile: File | null;
  loading: boolean;
  validationErrors: ErrorRow[];
}

export const initialState: () => UploadState = () => ({
  modelFile: null,
  dataFile: null,
  loading: false,
  validationErrors: [],
});

export function unpackOverlays(map_layers: any) {
  if (map_layers.length === 0) {
    return [[], []];
  }
  const map_layersVis = map_layers.map((l: any) => ({
    ...l,
    isVisible: false,
  }));
  const worldLayer = map_layersVis.find((l: any) => l.name === 'world');
  const overlayList = map_layersVis.filter((l: any) => l.name !== 'world');
  const worldMapLayers = worldLayer.overlays.map((o: any) => ({
    ...o,
    sourceLayer: worldLayer.name,
    sourceType: worldLayer.sourceType,
    isVisible: true,
  }));
  return overlayList.concat(worldMapLayers);
}

const groupByRow = (array: any): any => {
  const errorGrouped = array.reduce(
    (accumulatorList: { row: any; data: any[] }[], error: { row: any }) => {
      const group = accumulatorList.find((g) => g.row === error.row);
      if (group) {
        group.data.push(error);
      } else {
        accumulatorList.push({ row: error.row, data: [error] });
      }
      delete error.row;
      return accumulatorList;
    },
    []
  );
  return errorGrouped;
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState: initialState(),
  reducers: {
    setModelFile(state, action) {
      state.modelFile = action.payload;
    },
    setDataFile(state, action) {
      state.dataFile = action.payload;
    },
    uploadLoading(state, action) {
      state.loading = action.payload;
    },
    updateValidationErrors(state, action) {
      state.validationErrors = groupByRow(action.payload);
    },
  },
});

export const {
  setModelFile,
  setDataFile,
  uploadLoading,
  updateValidationErrors,
} = uploadSlice.actions;

export default uploadSlice.reducer;
