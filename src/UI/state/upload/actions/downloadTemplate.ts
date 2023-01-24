import { createAsyncThunk } from '@reduxjs/toolkit';
import { downloadTemplateFile } from '../../../api/api';

export const downloadTemplate = createAsyncThunk(
  'upload/downloadTemplate',
  async ({
    dataType,
    dataSource,
  }: {
    dataType: string;
    dataSource: string;
  }) => {
    await downloadTemplateFile(dataType, dataSource);
  }
);
