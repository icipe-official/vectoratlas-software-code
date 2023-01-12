import { Button, Box, Typography, Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setModelFile } from '../../../state/upload/uploadSlice';
import { uploadModel } from '../../../state/upload/actions/uploadModel';

function ModelUpload() {
  const currentUploadedModel = useAppSelector((s) => s.upload.modelFile);

  const [correctFileType, setCorrectFileType] = useState(false);
  const dispatch = useAppDispatch();

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      const isCorrectFileType =
        e.target.files![0].type === 'image/tiff' ||
        e.target.files![0].type === 'application/x-zip-compressed';
      setCorrectFileType(isCorrectFileType);
      if (isCorrectFileType) {
        dispatch(setModelFile(e.target.files![0]));
      }
    }
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
              ? correctFileType
                ? currentUploadedModel.name
                : 'Incorrect file type - tif or zip only'
              : 'No file chosen'}
          </Typography>
        </Grid>

        <Button
          variant="contained"
          data-testid="uploadButton"
          onClick={handleUpload}
          disabled={currentUploadedModel ? false : true}
        >
          Upload Model
        </Button>
      </Box>
    </form>
  );
}

export default ModelUpload;
