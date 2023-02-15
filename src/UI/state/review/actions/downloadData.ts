import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import { getDatasetData } from '../../../api/api';

export const downloadDatasetData = createAsyncThunk(
  'review/downloadDatasetData',
  async ({ datasetId }: { datasetId: string }, { dispatch }) => {
    //dispatch(setLoading(true));
    const data = await getDatasetData(datasetId);

    var file = new Blob([data.data], {
      type: 'text/csv;charset=utf-8',
    });

    FileSaver.saveAs(file, `data-${datasetId}.csv`);
  }
);
