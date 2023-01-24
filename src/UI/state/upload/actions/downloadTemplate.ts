import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import { downloadTemplateFile } from '../../../api/api';

export const downloadTemplate = createAsyncThunk('upload/downloadTemplate', async ({ dataType, dataSource }: { dataType: string; dataSource: string },) => {
    console.log('downloadTemplate')
    const fileBlob = await downloadTemplateFile(dataType, dataSource);
    FileSaver.saveAs(fileBlob, 'filteredVAData.csv');
  });
