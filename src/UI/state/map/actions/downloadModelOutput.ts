import { createAsyncThunk } from '@reduxjs/toolkit';
import { downloadModelOutputData } from '../../../api/api';

export const downloadModelOutput = (blobName: string, blobLocation: string) =>
  createAsyncThunk('map/downloadModelOutput', async () => {
    const fileBlob = await downloadModelOutputData(blobLocation);

    var link = document.createElement('a'); // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
    link.href = URL.createObjectURL(
      new Blob([fileBlob], { type: 'image/tiff' })
    );
    link.setAttribute('download', blobName + '.tif');
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
  });
