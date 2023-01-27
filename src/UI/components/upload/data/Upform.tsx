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
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { setDataFile } from '../../../state/upload/uploadSlice';
import { uploadData } from '../../../state/upload/actions/uploadData';
import TemplateDownload from './templateDownload';
import { getTemplateList } from '../../../state/upload/actions/downloadTemplate';

function Upform() {
  const currentUploadedData = useAppSelector((s) => s.upload.dataFile);
  const uploadLoading = useAppSelector((s) => s.upload.loading);
  const templateList = useAppSelector((s) => s.upload.templateList);
  const [datasetId, setDatasetId] = useState('');
  const [dataType, setDataType] = useState('');
  const [dataSource, setDataSource] = useState('');
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
    dispatch(uploadData({ datasetId, dataType, dataSource }));
  };

  return (
    <form>
      <Grid container direction="row" alignItems="center">
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-helper-label-source">Data Source</InputLabel>
          <Select
            labelId="select-helper-label-source"
            value={dataSource}
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
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-helper-label-type">Data Type</InputLabel>
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
        disabled={
          uploadLoading ||
          dataType === '' ||
          dataSource === '' ||
          currentUploadedData === null ||
          !correctFileType
        }
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
      <TemplateDownload />
    </form>
  );
}

export default Upform;
