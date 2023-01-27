import { createAsyncThunk } from '@reduxjs/toolkit';
import { downloadTemplateFile, fetchTemplateList } from '../../../api/api';

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

export const getTemplateList = createAsyncThunk(
  'upload/getTemplateList',
  async () => {
    return await fetchTemplateList();
  }
);

