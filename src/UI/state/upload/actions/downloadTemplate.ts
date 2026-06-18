import { createAsyncThunk } from '@reduxjs/toolkit';
import { downloadTemplateFile, fetchTemplateList } from '../../../api/api';
import { setTemplateList } from '../uploadSlice';

export const downloadTemplate = createAsyncThunk(
  'upload/downloadTemplate',
  async ({
    dataType,
    dataSource,
    extension,
  }: {
    dataType: string;
    dataSource: string;
    extension: string;
  }) => {
    await downloadTemplateFile(dataType, dataSource, extension);
  }
);

export const getTemplateList = createAsyncThunk(
  'upload/getTemplateList',
  async ({}, { dispatch }) => {
    const list = await fetchTemplateList();
    dispatch(setTemplateList(list));
  }
);
