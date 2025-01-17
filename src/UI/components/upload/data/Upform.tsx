import {
  Button,
  Grid,
  CircularProgress,
  TextField,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadData } from '../../../state/upload/actions/uploadData';
import TemplateDownload from './templateDownload';
import { getTemplateList } from '../../../state/upload/actions/downloadTemplate';
import { CountryList } from '../../shared/countryList';
import { toast } from 'react-toastify';
import { setDataFile } from '../../../state/upload/uploadSlice';
import { useRouter } from 'next/router';

function Upform() {
  const router = useRouter();
  const uploadLoading = useAppSelector((s) => s.upload.loading);
  const templateList = useAppSelector((s) => s.upload.templateList);
  const [datasetId, setDatasetId] = useState('');
  const [doi, setDOI] = useState('');
  const [dataType, setDataType] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [generateDoi, setGenerateDoi] = useState(true);
  const [correctFileType, setCorrectFileType] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null); // Local state to hold the file
  const [error, setError] = useState<boolean>(true); // Error state for file input
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTemplateList());
  }, [dispatch]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const isCorrectFileType = selectedFile.type === 'text/csv'; // Check for CSV file type
      setCorrectFileType(isCorrectFileType);
      setError(!isCorrectFileType); // Set error if file type is incorrect
      if (isCorrectFileType) {
        dispatch(
          setDataFile({ name: selectedFile.name, type: selectedFile.type })
        ); // Store only metadata in Redux state
        setCurrentFile(selectedFile); // Store the actual file object locally
      } else {
        toast.error('Please select a CSV file.'); // Error for incorrect file type
      }
    } else {
      setError(true); // Set error if no file is selected
      setCurrentFile(null);
    }
  };

  const handleUpload = async () => {
    if (currentFile) {
      // Check if the file is selected
      await dispatch(
        uploadData({
          datasetId,
          dataType,
          dataSource,
          doi,
          title,
          description,
          country,
          region,
          generateDoi,
          dataFile: currentFile, // Pass the file directly from local state
        })
      );
      setTimeout(() => {
        router.push('/'); //redirect to home after waiting for 2 seconds
      }, 2000);
    } else {
      toast.error('Please select a file before uploading.'); // Notify the user
    }
  };

  return (
    <form>
      <TemplateDownload />
      <Typography
        variant="h6"
        sx={{ marginBottom: 2, marginTop: 5 }}
        color="primary.main"
      >
        Upload
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item xs={12} md={6} container>
            <Grid item xs={12}>
              <TextField
                value={title}
                label="Dataset Title"
                onChange={(e) => setTitle(e.target.value)}
                error={title === ''}
                helperText={title === '' ? 'Please provide a title.' : ''}
                sx={{ padding: 1, width: '95%' }}
              />
              <TextField
                value={description}
                multiline
                rows={2}
                label="Dataset Description"
                onChange={(e) => setDescription(e.target.value)}
                error={description === ''}
                helperText={
                  description === '' ? 'Please provide a description.' : ''
                }
                sx={{ padding: 1, width: '95%' }}
              />
              <CountryList
                value={country}
                label="Country of Uploader *"
                onChange={(evt, val) => {
                  setCountry(val);
                }}
                sx={{ padding: 1, width: '95%' }}
              />
              <TextField
                value={region}
                label="Region"
                helperText={
                  region === ''
                    ? 'Please provide a valid region.' // Display error message if region is empty
                    : 'Region in the country where data was collected' // Regular helper text
                }
                onChange={(e) => setRegion(e.target.value)}
                error={region === ''} // Show error styling if region is empty
                sx={{ padding: 1, width: '95%', display: 'none' }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} container sx={{ alignItems: 'flex-start' }}>
            <Grid item xs={12}>
              <TextField
                disabled={uploadLoading}
                variant="outlined"
                label={'Dataset Id (if known)'}
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                data-testid="datasetIdInput"
                sx={{ /*marginLeft: '8px',*/ padding: 1, width: '95%' }}
              />
              <TextField
                disabled={uploadLoading}
                variant="outlined"
                label={'DOI/Citation (if exists)'}
                value={doi}
                onChange={(e) => setDOI(e.target.value)}
                data-testid="doiInput"
                sx={{ /*marginLeft: '8px',*/ padding: 1, width: '95%' }}
              />
              <Grid container direction={'row'} sx={{ alignItems: 'center' }}>
                <Button
                  sx={{
                    marginLeft: '14px',
                    borderColor: error ? 'red' : '', // Apply red border if error state is true
                    borderWidth: error ? '2px' : '', // Make the border thicker if error state is true
                  }}
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
                <Typography
                  sx={{
                    color: error ? 'red' : '',
                  }}
                >
                  {currentFile ? currentFile.name : 'No file chosen'}{' '}
                </Typography>
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
                  display: 'none',
                }}
              />
              <br />
              <Button
                sx={{ /*marginLeft: '14px',*/ padding: 1 }}
                variant="contained"
                data-testid="uploadButton"
                color="secondary"
                onClick={handleUpload}
                disabled={
                  uploadLoading ||
                  title === '' ||
                  description === '' ||
                  country === '' ||
                  // region === '' ||
                  !correctFileType
                }
              >
                Upload Data
              </Button>
              {uploadLoading ? (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress />
                </div>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}

export default Upform;
