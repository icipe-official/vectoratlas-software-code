import {
  Button,
  Grid,
  CircularProgress,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { setDataFile } from '../../../state/upload/uploadSlice';
import { uploadData } from '../../../state/upload/actions/uploadData';
import TemplateDownload from './templateDownload';
import { getTemplateList } from '../../../state/upload/actions/downloadTemplate';
import { CountryList } from '../../shared/countryList';
import { Text } from 'ol/style';

function Upform() {
  const currentUploadedData = useAppSelector((s) => s.upload.dataFile);
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
  const [correctFileType, setCorrectFileType] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTemplateList());
  }, [dispatch]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      const isCorrectFileType = e.target.files![0].type === 'text/csv';
      setCorrectFileType(isCorrectFileType);
      if (isCorrectFileType) {
        dispatch(setDataFile(e.target.files![0]));
      }
    }
  };

  const handleUpload = () => {
    dispatch(
      uploadData({
        datasetId,
        dataType,
        dataSource,
        doi,
        title,
        description,
        country,
        region,
      })
    );
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
            <Grid xs={12}>
              {/* <FormControl sx={{ m: 1, marginLeft: 0, minWidth: 120 }}>
                <InputLabel hidden id="select-helper-label-source">
                  Data Source
                </InputLabel>
                <Select
                  labelId="select-helper-label-source"
                  value={dataSource}
                  hidden
                  label="Data source"
                  onChange={(e) => setDataSource(e.target.value)}
                  sx={{ width: '150px' }}
                >
                  {templateList.map((template) => (
                    <MenuItem key={template} value={template}>
                      {template}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl hidden sx={{ m: 1, minWidth: 120 }}>
                <InputLabel hidden id="select-helper-label-type">
                  Data Type
                </InputLabel>
                <Select
                  labelId="select-helper-label-type"
                  value={dataType}
                  label="Data type"
                  onChange={(e) => setDataType(e.target.value)}
                  sx={{ width: '150px' }}
                >
                  <MenuItem value={'bionomics'}>Bionomics</MenuItem>
                  <MenuItem value={'occurrence'}>Occurrence</MenuItem>
                </Select>
              </FormControl> */}

              <TextField
                value={title}
                label="Dataset Title"
                onChange={(e) => setTitle(e.target.value)}
                sx={{ padding: 1, width: '95%' }}
              />
              <TextField
                value={description}
                multiline
                rows={2}
                label="Dataset Description"
                onChange={(e) => setDescription(e.target.value)}
                sx={{ padding: 1, width: '95%' }}
              />
              <CountryList
                value={country}
                label="Source country"
                onChange={(evt, val) => {
                  setCountry(val);
                }}
                sx={{ padding: 1, width: '95%' }}
              />
              <TextField
                value={region}
                label="Region"
                helperText="Region in the country where data was collected"
                onChange={(e) => setRegion(e.target.value)}
                sx={{ padding: 1, width: '95%' }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} container sx={{ alignItems: 'flex-start' }}>
            <Grid xs={12}>
              <TextField
                disabled={uploadLoading}
                variant="outlined"
                label={'Dataset Id (if known)'}
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                data-testid="datasetIdInput"
                sx={{ marginLeft: '8px', padding: 1, width: '95%'}}
              />
              <TextField
                disabled={uploadLoading}
                variant="outlined"
                label={'DOI (if known)'}
                value={doi}
                onChange={(e) => setDOI(e.target.value)}
                data-testid="doiInput"
                sx={{ marginLeft: '8px', padding: 1, width: '95%' }}
              />
              <Button
                sx={{ marginLeft: '14px' }}
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
              <br />
              <FormControlLabel
                control={<Checkbox />}
                label="Generate a DOI for this dataset?"
                sx={{ marginLeft: '1px', padding: 0, width: '95%' }}
              />
              <br />
              <Button
                sx={{ marginLeft: '14px', padding: 1 }}
                variant="contained"
                data-testid="uploadButton"
                color="secondary"
                onClick={handleUpload}
                disabled={
                  uploadLoading ||
                  // dataType === '' ||
                  // dataSource === '' ||
                  title === '' ||
                  description === '' ||
                  country === '' ||
                  region === '' ||
                  currentUploadedData === null ||
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
      {/* <Grid container direction="row" alignItems="center">
        <FormControl sx={{ m: 1, marginLeft: 0, minWidth: 120 }}>
          <InputLabel hidden id="select-helper-label-source">
            Data Source
          </InputLabel>
          <Select
            labelId="select-helper-label-source"
            value={dataSource}
            hidden
            label="Data source"
            onChange={(e) => setDataSource(e.target.value)}
            sx={{ width: '150px' }}
          >
            {templateList.map((template) => (
              <MenuItem key={template} value={template}>
                {template}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl hidden sx={{ m: 1, minWidth: 120 }}>
          <InputLabel hidden id="select-helper-label-type">
            Data Type
          </InputLabel>
          <Select
            labelId="select-helper-label-type"
            value={dataType}
            label="Data type"
            onChange={(e) => setDataType(e.target.value)}
            sx={{ width: '150px' }}
          >
            <MenuItem value={'bionomics'}>Bionomics</MenuItem>
            <MenuItem value={'occurrence'}>Occurrence</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, marginLeft: 0, minWidth: 120 }}>
          <TextField
            disabled={uploadLoading}
            variant="outlined"
            label={'Dataset Id (if known)'}
            value={datasetId}
            onChange={(e) => setDatasetId(e.target.value)}
            data-testid="datasetIdInput"
            sx={{ marginLeft: '8px' }}
          />
        </FormControl>
        <FormControl sx={{ m: 1, marginLeft: 0, minWidth: 120 }}>
          <TextField
            disabled={uploadLoading}
            variant="outlined"
            label={'DOI (if known)'}
            value={doi}
            onChange={(e) => setDOI(e.target.value)}
            data-testid="doiInput"
            sx={{ marginLeft: '15px' }}
          />
        </FormControl>
      </Grid>
      <Grid container direction={'row'} sx={{ alignItems: 'center' }}>
        <Button
          sx={{ marginLeft: 0 }}
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

        <FormControl sx={{ m: 1, marginLeft: 0, minWidth: 120 }}>
          <TextField
            multiline
            rows={3}
            value={description}
            label="Dataset Description"
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: '250px' }}
          />
        </FormControl>
        <CountryList
          value={country}
          onChange={(evt, val) => {
            setCountry(val);
          }}
        />
        <TextField
          value={region}
          label="Region"
          helperText="Region in the country where data was collected"
          onChange={(e) => setRegion(e.target.value)}
          sx={{ width: '250px' }}
        />
      </Grid>

      <Button
        sx={{ marginLeft: 0 }}
        variant="contained"
        data-testid="uploadButton"
        color="secondary"
        onClick={handleUpload}
        disabled={
          uploadLoading ||
          // dataType === '' ||
          // dataSource === '' ||
          description === '' ||
          country === '' ||
          region === '' ||
          currentUploadedData === null ||
          !correctFileType
        }
      >
        Upload Data
      </Button>
      {uploadLoading ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : null} */}
    </form>
  );
}

export default Upform;
