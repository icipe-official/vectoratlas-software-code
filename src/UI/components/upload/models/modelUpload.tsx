import {
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setModelFile } from '../../../state/upload/uploadSlice';
import { uploadModel } from '../../../state/upload/actions/uploadModel';

function ModelUpload() {
  const currentUploadedModel = useAppSelector((s) => s.upload.modelFile);
  const uploadLoading = useAppSelector((s) => s.upload.loading);
  const [displayName, setDisplayName] = useState('');
  const [maxValue, setMaxValue] = useState<String>('');
  const displayNameValid = displayName !== '';
  const maxValueValid = maxValue !== '';

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
    dispatch(uploadModel({ displayName, maxValue }));
  };

  const uploadDisabled = currentUploadedModel
    ? uploadLoading || !displayNameValid || !maxValueValid
    : true;

  return (
    <form>
      <Box sx={{ height: '75%' }}>
        <Grid container direction="row" alignItems="center">
          <TextField
            disabled={uploadLoading}
            variant="outlined"
            label={'Display name:'}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            error={!displayNameValid}
            helperText={!displayNameValid ? 'Display name cannot be empty' : ''}
            data-testid="displayNameInput"
          />
          <TextField
            disabled={uploadLoading}
            variant="outlined"
            label={'Maximum value:'}
            value={maxValue}
            type="number"
            onChange={(e) => setMaxValue(e.target.value)}
            error={!maxValueValid}
            helperText={!maxValueValid ? 'Maximum value cannot be empty' : ''}
            sx={{ paddingLeft: '5px' }}
            data-testid="maxValueInput"
          />
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

export default ModelUpload;
