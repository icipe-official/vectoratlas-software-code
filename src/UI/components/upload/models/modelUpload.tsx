import {
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setModelFile } from '../../../state/upload/uploadSlice';
import { uploadModel } from '../../../state/upload/actions/uploadModel';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { CountryList } from '../../shared/countryList';

function ModelUpload() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const uploadLoading = useAppSelector((s) => s.upload.loading);

  const [displayName, setDisplayName] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [correctFileType, setCorrectFileType] = useState(false);
  const [error, setError] = useState(true);

  // New metadata fields
  const [authors, setAuthors] = useState('');
  const [country, setCountry] = useState('');
  const [institute, setInstitute] = useState('');
  const [doi, setDOI] = useState('');
  const displayNameValid = displayName !== '';
  const maxValueValid = maxValue !== '';
  const authorsValid = authors !== '';
  const countryValid = country !== '';
  const instituteValid = institute !== '';
  const [generateDoi, setGenerateDoi] = useState(true);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const isCorrectFileType =
        selectedFile.type === 'image/tiff' ||
        selectedFile.type === 'application/x-zip-compressed';

      setCorrectFileType(isCorrectFileType);
      setError(!isCorrectFileType);

      if (isCorrectFileType) {
        dispatch(setModelFile({ name: selectedFile.name, type: selectedFile.type }));
        setCurrentFile(selectedFile);
      } else {
        toast.error('Please select a valid .tif or .zip file.');
        setCurrentFile(null);
      }
    } else {
      setError(true);
      setCurrentFile(null);
    }
  };

  const handleUpload = async () => {
    if (!currentFile) {
      toast.error('Please select a model file before uploading.');
      return;
    }

    await dispatch(
      uploadModel({
        displayName,
        maxValue,
        authors,
        country,
        institute,
        generateDoi,
        modelFile: currentFile,
      })
    );

    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const uploadDisabled =
    uploadLoading ||
    !displayNameValid ||
    !maxValueValid ||
    !correctFileType ||
    !authorsValid ||
    !countryValid ||
    !instituteValid;

  return (
    <form>
      <Box sx={{ height: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2 }} color="primary.main">
          Upload Model
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={uploadLoading}
              //error={!displayNameValid}
              helperText={!displayNameValid ? 'Required' : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Maximum value"
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              disabled={uploadLoading}
              //error={!maxValueValid}
              helperText={!maxValueValid ? 'Required' : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Authors"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              disabled={uploadLoading}
              //error={!authorsValid}
              helperText={!authorsValid ? 'Required' : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <CountryList
              value={country}
              label="Country of Uploader *"
              onChange={(evt, val) => {
                setCountry(val);
              }}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Affiliated Institution"
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              disabled={uploadLoading}
              //error={!regionValid}
              helperText={
                institute === ''
                  ? 'Please provide a valid Institution.'
                  :""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="DOI/Citation (if exists)"
              value={doi}
              onChange={(e) => setDOI(e.target.value)}
              disabled={uploadLoading}
            />
          </Grid>

          <br />
          <FormControlLabel
            control={<Checkbox />}
            label="Generate a DOI for this dataset?"
            onChange={(evt, val) => setGenerateDoi(val)}
            value={true}
            sx={{
              marginLeft: '1px',
              padding: 0,
              width: '95%',
              //display: 'none',
            }}
          />
          <br />

          {/* File Upload */}
          <Grid item xs={6}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{
                borderColor: error ? 'red' : '',
                borderWidth: error ? '2px' : '',
              }}
            >
              Choose model file
              <input
                type="file"
                accept=".tif,.zip"
                hidden
                onChange={handleFileSelect}
              />
            </Button>
            <Typography sx={{ color: error ? 'red' : '' }}>
              {currentFile ? currentFile.name : 'No file chosen'}
            </Typography>
          </Grid>

          {/* Upload Button */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploadDisabled}
            >
              Upload Model
            </Button>
          </Grid>

          {uploadLoading && (
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </form>
  );
}

export default ModelUpload;
