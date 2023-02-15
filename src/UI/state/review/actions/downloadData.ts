import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import { toast } from 'react-toastify';
import { getDatasetData } from '../../../api/api';
import { setDownloading } from '../reviewSlice';

export const downloadDatasetData = createAsyncThunk(
  'review/downloadDatasetData',
  async ({ datasetId }: { datasetId: string }, { dispatch }) => {
    dispatch(setDownloading(true));
    try {
      const data = await getDatasetData(datasetId);

      var file = new Blob([data.data], {
        type: 'text/csv;charset=utf-8',
      });

      FileSaver.saveAs(file, `data-${datasetId}.csv`);
      dispatch(setDownloading(false));
    } catch (e) {
      toast.error('Something went wrong with data download. Please try again.');
      dispatch(setDownloading(false));
    }
  }
);
