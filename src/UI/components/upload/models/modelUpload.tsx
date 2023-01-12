import { Button, Box, Typography, Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setModelFile } from '../../../state/upload/uploadSlice';
import { uploadModel } from '../../../state/upload/actions/uploadModel';

function ModelUpload() {
  const currentUploadedModel = useAppSelector((s) => s.upload.modelFile);
  const uploadLoading = useAppSelector((s) => s.upload.loading);

  const dispatch = useAppDispatch();
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModelFile(e.target.files![0]));
  };

  const handleUpload = () => {
    dispatch(uploadModel());
  };

  return (
    <form>
      <Box sx={{ height: '75%' }}>
        <Grid container direction="row" alignItems="center">
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
          >
            Choose model file
            <input
              type="file"
              accept=".tif, .zip"
              data-testid="fileUpload"
              hidden
              onChange={handleFileSelect}
            />
          </Button>
          <Typography>
            {currentUploadedModel
              ? currentUploadedModel.name
              : 'No file chosen'}
          </Typography>
        </Grid>

        <Button
          variant="contained"
          data-testid="uploadButton"
          onClick={handleUpload}
          disabled={currentUploadedModel ? uploadLoading : true}
        >
          Upload Model
        </Button>
      </Box>
    </form>
  );
}

export default ModelUpload;
