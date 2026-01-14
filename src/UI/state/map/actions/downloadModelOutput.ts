import { createAsyncThunk } from '@reduxjs/toolkit';
import { downloadModelOutputData } from '../../../api/api';

export const downloadModelOutput = createAsyncThunk(
  'map/downloadModelOutput',
  async ({
    blobName,
    blobLocation,
  }: {
    blobName: string;
    blobLocation: string;
  }) => {
    const fileBlob = await downloadModelOutputData(blobLocation);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(
      new Blob([fileBlob as any], { type: 'image/tiff' })
    );
    link.setAttribute('download', `${blobName}.tif`);
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
  }
);
