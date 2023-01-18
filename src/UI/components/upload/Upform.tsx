import { Button, Grid, AppBar, Toolbar, Container, Box, CircularProgress, TextField, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { uploadLoading } from '../../state/upload/uploadSlice';

function Upform() {
  const currentUploadedModel = useAppSelector((s) => s.upload.dataFile);
  const [datasetId, setDatasetId] = useState('');
  const [correctFileType, setCorrectFileType] = useState(false);
  const dispatch = useAppDispatch();

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      const isCorrectFileType =
        e.target.files![0].type === 'csv'
      setCorrectFileType(isCorrectFileType);
      if (isCorrectFileType) {
        dispatch(setDataFile(e.target.files![0]));
      }
    }
  };
  return (
    <form>
      <Box sx={{ height: '75%' }}>
        <Grid container direction="row" alignItems="center">
          <TextField
            //disabled={uploadLoading}
            variant="outlined"
            label={'Dataset Id (if known)'}
            value={datasetId}
            onChange={(e) => setDatasetId(e.target.value)}
            data-testid="datasetIdInput"
          />
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
          >
            Choose data file
            <input
              type="file"
              accept=".csv"
              data-testid="fileUpload"
              hidden
              onChange={handleFileSelect}
            />
          </Button>
          <Typography>
            {currentUploadedData
              ? correctFileType
                ? currentUploadedData.name
                : 'Incorrect file type - csv only'
              : 'No file chosen'}
          </Typography>
        </Grid>

        <Button
          variant="contained"
          data-testid="uploadButton"
          onClick={handleUpload}
          disabled={uploadDisabled}
        >
          Upload Model
        </Button>
        {uploadLoading ? (
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <CircularProgress />
          </div>
        ) : null}
      </Box>
    </form>
  );
}

export default Upform;
