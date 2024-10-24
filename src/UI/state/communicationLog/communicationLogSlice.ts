import { createSlice } from '@reduxjs/toolkit';
import { CommunicationLog } from '../state.types';

export interface CommunicationLogState {
  currentCommunicationLog: CommunicationLog | null;
  loading: boolean;
  communicationLogs: CommunicationLog[];
}

export const initialState: () => CommunicationLogState = () => ({
  currentCommunicationLog: null,
  loading: false,
  communicationLogs: [],
});

export const communicationLogSlice = createSlice({
  name: 'communicationLogs',
  initialState: initialState(),
  reducers: {
    setCurrentCommunicationLog(state, action) {
      state.currentCommunicationLog = action.payload;
    },
    communicationLogLoading(state, action) {
      state.loading = action.payload;
    },
    setCommunicationLogs(state, action) {
      state.communicationLogs = action.payload;
    },
  },
});

export const {
  setCurrentCommunicationLog,
  communicationLogLoading,
  setCommunicationLogs,
} = communicationLogSlice.actions;

export default communicationLogSlice.reducer;
