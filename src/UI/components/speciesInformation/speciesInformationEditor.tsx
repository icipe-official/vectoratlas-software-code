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
import { useTranslations } from 'next-intl';

const UPLOAD_LIMIT_IN_KB = 512;

const SpeciesInformationEditor = () => {
  const t = useTranslations('SpeciesPage');

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
      const error = t('speciesInformation.uploadImageFileHelperText', {
        maxSize: UPLOAD_LIMIT_IN_KB,
      });

      toast.error(error, {
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
        {id ? t('speciesInformation.edit') : t('speciesInformation.create')}{' '}
        species information
      </Typography>
      {loadingSpeciesInformation ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : null}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformation.name')}
      </Typography>
      <TextField
        disabled={loadingSpeciesInformation}
        variant="outlined"
        sx={{ width: '100%' }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!nameValid}
        helperText={!nameValid ? t('speciesInformation.nameHelperText') : ''}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformation.shortDescription')}
      </Typography>
      {!loadingSpeciesInformation ? (
        <ShortTextEditor
          shortDescription={shortDescription}
          setShortDescription={setShortDescription}
          initialShortDescription={shortDescription}
          error={!shortDescriptionValid}
          helperText={
            !shortDescriptionValid
              ? t('speciesInformation.shortDescriptionHelperText')
              : undefined
          }
        />
      ) : (
        <div style={{ height: 150 }} />
      )}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformation.fullDescription')}
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
        {t('speciesInformation.image')}
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
          {t('speciesInformation.uploadImageFile')}
          <input
            data-testid="image-upload-input"
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        <Typography>
          {t('speciesInformation.uploadImageFileHelperText', {
            maxSize: UPLOAD_LIMIT_IN_KB,
          })}
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
        {t('speciesInformation.distributionMapImage')}
      </Typography>
      {/* <div>Placeholder</div> */}
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
          {id
            ? t('speciesInformation.buttons.update')
            : t('speciesInformation.buttons.create')}
        </Button>
      </div>
    </div>
  );
};

export default SpeciesInformationEditor;
