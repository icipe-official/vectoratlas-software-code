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
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setModelFile } from '../../../state/upload/uploadSlice';
import { uploadModel } from '../../../state/upload/actions/uploadModel';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { CountryList } from '../../shared/countryList';
import { uploadLoading as setUploadLoading } from '../../../state/upload/uploadSlice';
import { useTranslations } from 'next-intl';

// import ReactQuill from 'react-quill';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function ModelUpload() {
  const t = useTranslations('UploadedModelDetailPage');

  const dispatch = useAppDispatch();
  const router = useRouter();

  const uploadLoading = useAppSelector((s) => s.upload.loading);

  const [displayName, setDisplayName] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [correctFileType, setCorrectFileType] = useState(false);
  const [error, setError] = useState(true);
  const [description, setDescription] = useState('');

  // New metadata fields
  const [authors, setAuthors] = useState('');
  const [country, setCountry] = useState('');
  const [institution, setInstitution] = useState('');
  const [doi, setDOI] = useState('');
  const displayNameValid = displayName !== '';
  const maxValueValid = maxValue !== '';
  const authorsValid = authors !== '';
  const countryValid = country !== '';
  const institutionValid = institution !== '';
  const descriptionValid = description !== '';
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
        dispatch(
          // setModelFile({ name: selectedFile.name, type: selectedFile.type })
          setModelFile(selectedFile)
        );
        setCurrentFile(selectedFile);
      } else {
        toast.error(
          //'Please select a valid .tif or .zip file.'
          t('form.errors.invalidFile')
        );
        setCurrentFile(null);
      }
    } else {
      setError(true);
      setCurrentFile(null);
    }
  };

  const handleUpload = async () => {
    if (!currentFile) {
      toast.error(
        //'Please select a model file before uploading.'
        t('form.errors.noFileSelected')
      );
      return;
    }
    const res = await dispatch(
      uploadModel({
        displayName,
        maxValue,
        generateDoi,
        authors,
        institution,
        country,
        providedDoi: doi,
        comments: description,
        //modelFile: currentFile,
      })
    );
    if (!res || 'error' in res) {
      // error
      setUploadLoading(false);
      console.log(res.error.message);
      toast.error(t('form.errors.uploadError'));
    } else {
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  let uploadDisabled =
    uploadLoading ||
    !displayNameValid ||
    !maxValueValid ||
    !correctFileType ||
    !authorsValid ||
    !countryValid ||
    !institutionValid ||
    !descriptionValid;

  return (
    <form>
      <Box sx={{ height: 'auto' }}>
        {/* <Typography variant="h6" sx={{ mb: 2 }} color="primary.main">
          Upload Model
        </Typography> */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('form.displayName')}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={uploadLoading}
              error={!displayNameValid}
              helperText={!displayNameValid ? t('form.errors.required') : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <CountryList
              value={country}
              label={t('form.uploaderCountry')}
              helperText={t('form.uploaderCountryHelperText')}
              onChange={(evt, val) => {
                setCountry(val);
              }}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('form.maximumValue')}
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              disabled={uploadLoading}
              error={!maxValueValid}
              helperText={!maxValueValid ? t('form.errors.required') : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox />}
              label={t('form.generateDoi')}
              onChange={(evt, val) => setGenerateDoi(val)}
              value={true}
              sx={{
                marginLeft: '1px',
                padding: 0,
                width: '95%',
                //display: 'none',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('form.authors')}
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              disabled={uploadLoading}
              error={!authorsValid}
              helperText={!authorsValid ? t('form.errors.required') : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('form.providedDoi')}
              value={doi}
              onChange={(e) => setDOI(e.target.value)}
              disabled={uploadLoading}
              // hidden={!generateDoi}
              style={{ display: generateDoi ? 'none' : 'block' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('form.institution')}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              disabled={uploadLoading}
              error={!institutionValid}
              helperText={institution === '' ? t('form.errors.required') : ''}
            />
          </Grid>

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
              {t('form.chooseFile')}
              <input
                type="file"
                accept=".tif,.zip"
                hidden
                onChange={handleFileSelect}
              />
            </Button>
            <Typography sx={{ color: error ? 'red' : '' }}>
              {currentFile ? currentFile.name : t('form.errors.emptyFile')}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <ReactQuill
              value={description}
              onChange={(val) => {
                setDescription(val);
              }}
              //error={!descriptionValid}
              // helperText={!descriptionValid ? 'Required' : ''}
              placeholder={t('form.descriptionPlaceholder')}
              // style={{ minHeight: '300px' }}
              theme="snow"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  [{ header: '1' }, { header: '2' }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ align: [] }],
                  [
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { indent: '-1' },
                    { indent: '+1' },
                  ],
                  [{ color: [] }, { background: [] }],
                  ['image' /*, 'link'*/, 'clean'],
                ],
              }}
              formats={[
                'header',
                'bold',
                'italic',
                'underline',
                'strike',
                'list',
                'bullet',
                'link',
                'indent',
                'align',
                'image',
                'color',
                'background',
              ]}
            />
          </Grid>
          {/* Upload Button */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={
                uploadLoading ||
                !displayNameValid ||
                !maxValueValid ||
                !correctFileType ||
                !authorsValid ||
                !countryValid ||
                !institutionValid ||
                !descriptionValid
              }
            >
              {t('form.submit')}
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
