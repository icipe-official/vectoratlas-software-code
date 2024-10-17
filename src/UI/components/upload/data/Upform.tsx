import {
  Button,
  Grid,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadData } from '../../../state/upload/actions/uploadData';
import TemplateDownload from './templateDownload';
import { getTemplateList } from '../../../state/upload/actions/downloadTemplate';
import { toast } from 'react-toastify';
import { setDataFile } from '../../../state/upload/uploadSlice';

function Upform() {
  const uploadLoading = useAppSelector((s) => s.upload.loading);
  const templateList = useAppSelector((s) => s.upload.templateList);
  const [datasetId, setDatasetId] = useState('');
  const [doi, setDOI] = useState('');
  const [dataType, setDataType] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [datasetloc, setDatasetLoc] = useState('');
  const [region, setRegion] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(null); // Local state to hold the file

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTemplateList());
  }, [dispatch]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const isCorrectFileType = selectedFile.type === 'text/csv'; // Check for CSV file type
      if (isCorrectFileType) {
        dispatch(setDataFile({ name: selectedFile.name, type: selectedFile.type })); // Store only metadata in Redux state
        setCurrentFile(selectedFile); // Store the actual file object locally
      } else {
        toast.error('Please select a CSV file.'); // Error for incorrect file type
      }
    }
  };

  const handleUpload = () => {
    if (currentFile) { // Check if the file is selected
      dispatch(
        uploadData({
          
          dataType,
          dataSource,
          doi,
          desc,
          title,
          datasetloc,
          region,
          dataFile: currentFile, // Pass the file directly from local state
        })
      );
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
      <Grid container direction="row" alignItems="center">  
        <TextField
          disabled={uploadLoading}
          variant="outlined"
          label={'DOI (if known)'}
          value={doi}
          onChange={(e) => setDOI(e.target.value)}
        />
        <TextField
          disabled={uploadLoading}
          variant="outlined"
          label={'Dataset Title'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ marginLeft: '15px' }}
        />
        <TextField
          disabled={uploadLoading}
          variant="outlined"
          label={'Dataset description'}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          sx={{ marginLeft: '15px' }}
        />
        <TextField
          disabled={uploadLoading}
          variant="outlined"
          label={'Dataset collection country'}
          value={datasetloc}
          onChange={(e) => setDatasetLoc(e.target.value)}
          sx={{ marginLeft: '15px' }}
        />
        <TextField
          disabled={uploadLoading}
          variant="outlined"
          label={'Dataset collection Region'}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
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
          {currentFile ? currentFile.name : 'No file chosen'} {/* Display selected file name */}
        </Typography>
      </Grid>

      <Button
        sx={{ marginLeft: 0 }}
        variant="contained"
        data-testid="uploadButton"
        color="secondary"
        onClick={handleUpload}
        disabled={uploadLoading}
      >
        Upload Data
      </Button>

      {uploadLoading && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      )}
    </form>
  );
}

export default Upform;
