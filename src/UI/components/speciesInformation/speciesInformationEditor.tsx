import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Typography, CircularProgress, TextField } from '@mui/material';
import { TextEditor } from '../shared/textEditor/RichTextEditor';
import { ShortTextEditor } from '../shared/textEditor/shortTextEditor';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  getSpeciesInformation,
  upsertSpeciesInformation,
} from '../../state/speciesInformation/actions/upsertSpeciesInfo.action';
import { SpeciesInformation } from '../../state/state.types';
import { toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/Upload';
import { toBase64 } from '../shared/imageTools';

const UPLOAD_LIMIT_IN_KB = 512;

const SpeciesInformationEditor = () => {
  const [description, setDescription] = useState('');
  const [initialDescription, setInitialDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [speciesImage, setSpeciesImage] = useState('');
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const currentSpeciesInformation = useAppSelector(
    (s) => s.speciesInfo.currentInfoForEditing
  );
  const loadingSpeciesInformation = useAppSelector(
    (s) => s.speciesInfo.loading
  );

  const router = useRouter();
  const id = router.query.id as string | undefined;

  const saveSpeciesInformation = useCallback(() => {
    const speciesInformation: SpeciesInformation = {
      id,
      name,
      shortDescription,
      description,
      speciesImage,
    };
    dispatch(upsertSpeciesInformation(speciesInformation));
  }, [dispatch, id, description, name, shortDescription, speciesImage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // only allow images below 512 KB
    if (e.target.files && e.target.files[0].size < UPLOAD_LIMIT_IN_KB * 1024) {
      const speciesImage = await toBase64(e.target.files[0]);
      setSpeciesImage(speciesImage);
    } else {
      toast.error('Uploaded files must be less than 512 KB.', {
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getSpeciesInformation(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSpeciesInformation) {
      setName(currentSpeciesInformation.name);
      setShortDescription(currentSpeciesInformation.shortDescription);
      setDescription(currentSpeciesInformation.description);
      setInitialDescription(currentSpeciesInformation.description);
      setSpeciesImage(currentSpeciesInformation.speciesImage);
    }
  }, [currentSpeciesInformation]);

  const nameValid = name !== '';
  const shortDescriptionValid = shortDescription !== '';

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        {id ? 'Edit' : 'Create'} species information
      </Typography>
      {loadingSpeciesInformation ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : null}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Name
      </Typography>
      <TextField
        disabled={loadingSpeciesInformation}
        variant="outlined"
        sx={{ width: '100%' }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!nameValid}
        helperText={!nameValid ? 'Name cannot be empty' : ''}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Short description
      </Typography>
      {!loadingSpeciesInformation ? (
        <ShortTextEditor
          shortDescription={shortDescription}
          setShortDescription={setShortDescription}
          initialShortDescription={shortDescription}
          error={!shortDescriptionValid}
          helperText={
            !shortDescriptionValid
              ? 'Short description cannot be empty'
              : undefined
          }
        />
      ) : (
        <div style={{ height: 150 }} />
      )}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Full Description
      </Typography>
      {!loadingSpeciesInformation ? (
        <TextEditor
          description={description}
          setDescription={setDescription}
          initialDescription={initialDescription}
        />
      ) : (
        <div style={{ height: 250 }} />
      )}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Species image
      </Typography>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Button
          disabled={loadingSpeciesInformation}
          variant="contained"
          component="label"
          style={{ width: '50%', minWidth: '250px' }}
        >
          <UploadIcon />
          Upload Species Image File
          <input
            data-testid="image-upload-input"
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        <Typography>
          Images must be smaller than {UPLOAD_LIMIT_IN_KB} KB.
        </Typography>
        {speciesImage ? (
          <picture>
            <img
              style={{ width: '30vw' }}
              src={speciesImage}
              alt="Species image"
            />
          </picture>
        ) : null}
      </div>

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Distribution map image
      </Typography>
      <div>Placeholder</div>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}
      >
        <Button
          variant="contained"
          disabled={
            loadingSpeciesInformation || !nameValid || !shortDescriptionValid
          }
          onClick={saveSpeciesInformation}
          sx={{ m: 0, minWidth: 150 }}
        >
          {id ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

export default SpeciesInformationEditor;
