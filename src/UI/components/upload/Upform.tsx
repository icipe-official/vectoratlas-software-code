import { Button, Grid, Box, CircularProgress, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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
        e.target.files![0].type === 'text/csv'
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
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Data Type</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              value={dataType}
              label="Data type"
              onChange={(e) => setDataType(e.target.value)}
              sx={{width: '150px'}}
            >
              <MenuItem value={'bionomics'}>Bionomics</MenuItem>
              <MenuItem value={'occurrence'}>Occurrence</MenuItem>
            </Select>
          </FormControl>
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
          disabled={uploadLoading || dataType === '' || currentUploadedData === null || !correctFileType}
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
