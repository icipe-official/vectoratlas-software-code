import { Button, Grid, Box, CircularProgress, TextField, Typography, MenuItem, Select } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { setDataFile, uploadLoading } from '../../state/upload/uploadSlice';
import { uploadData } from '../../state/upload/actions/uploadData';

function Upform() {
  const currentUploadedData = useAppSelector((s) => s.upload.dataFile);
  const uploadLoading = useAppSelector((s) => s.upload.loading);
  const [datasetId, setDatasetId] = useState('');
  const [dataType, setDataType] = useState('');
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

  const handleUpload = () => {
    dispatch(uploadData({ datasetId, dataType }));
  };

  return (
    <form>
      <Box sx={{ height: '75%' }}>
        <Grid container direction="row" alignItems="center">
          <Select
            value={dataType}
            label="Age"
            onChange={(e) => setDataType(e.target.value)}
          >
            <MenuItem value={'bionomics'}>Bionomics</MenuItem>
            <MenuItem value={'occurrence'}>Occurrence</MenuItem>
          </Select>
          <TextField
            disabled={uploadLoading}
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
          disabled={uploadLoading || dataType === ''}
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
