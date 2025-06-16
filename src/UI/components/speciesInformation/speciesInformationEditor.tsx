import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  Box
} from '@mui/material';
import dynamic from 'next/dynamic';
import { ShortTextEditor } from '../shared/textEditor/shortTextEditor';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  getSpeciesInformation,
  upsertSpeciesInformation,
} from '../../state/speciesInformation/actions/upsertSpeciesInfo.action';
import { SpeciesInformation } from '../../state/state.types';
import { toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import { toBase64 } from '../shared/imageTools';
import { useTranslations } from 'next-intl';

const UPLOAD_LIMIT_IN_KB = 512;

import { TextEditor } from '../shared/textEditor/RichTextEditor';

type Subsection = {
  title: string;
  content: string;
};

const SpeciesInformationEditor = () => {
  const t = useTranslations('SpeciesPage');

  const [shortDescription, setShortDescription] = useState('');
  const [speciesImage, setSpeciesImage] = useState('');
  const [name, setName] = useState('');
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const dispatch = useAppDispatch();

  const currentSpeciesInformation = useAppSelector(
    (s) => s.speciesInfo.currentInfoForEditing
  );
  const loadingSpeciesInformation = useAppSelector(
    (s) => s.speciesInfo.loading
  );

  const router = useRouter();
  const id = router.query.id as string | undefined;

  const handleAddSubsection = () => {
    setSubsections([...subsections, { title: '', content: '' }]);
  };

  const handleRemoveSubsection = (index: number) => {
    setSubsections(subsections.filter((_, i) => i !== index));
  };

  const updateSubsection = (
    index: number,
    field: 'title' | 'content',
    value: string
  ) => {
    const updated = [...subsections];
    updated[index][field] = value;
    setSubsections(updated);
  };

  const saveSpeciesInformation = useCallback(() => {
    const speciesInformation: SpeciesInformation = {
      id,
      name,
      shortDescription,
      description: JSON.stringify(subsections),
      speciesImage,
    };

    dispatch(upsertSpeciesInformation(speciesInformation));
    toast.success('Species information saved!');
    setSubsections([]);
    setName("");
    setShortDescription("");
    setSpeciesImage("");
  }, [dispatch, id, name, shortDescription, speciesImage, subsections]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      try {
        setSubsections(JSON.parse(currentSpeciesInformation.description || '[]'));
      } catch {
        setSubsections([]);
      }
      setSpeciesImage(currentSpeciesInformation.speciesImage);
    }
  }, [currentSpeciesInformation]);

  const nameValid = name !== '';
  const shortDescriptionValid = shortDescription !== '';

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        {id ? t('speciesInformation.edit') : t('speciesInformation.create')} species information
      </Typography>

      {loadingSpeciesInformation && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformation.name')}
      </Typography>
      <TextField
        disabled={loadingSpeciesInformation}
        variant="outlined"
        fullWidth
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

      {subsections.map((subsection, index) => (
        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
          <TextField
            label={`Subsection ${index + 1} Title`}
            variant="outlined"
            fullWidth
            value={subsection.title}
            onChange={(e) =>
              updateSubsection(index, 'title', e.target.value)
            }
            sx={{ mb: 2 }}
          />
          <TextEditor
            description={subsection.content}
            setDescription={(val) => updateSubsection(index, 'content', val)}
            initialDescription={subsection.content}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <IconButton
              color="error"
              onClick={() => handleRemoveSubsection(index)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button onClick={handleAddSubsection} variant="outlined">
          + Add Subsection
        </Button>
      </Box>

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformation.image')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button
          disabled={loadingSpeciesInformation}
          variant="contained"
          component="label"
          sx={{ width: '50%', minWidth: '250px' }}
        >
          <UploadIcon />
          {t('speciesInformation.uploadImageFile')}
          <input
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
        {speciesImage && (
          <img
            style={{ width: '30vw', marginTop: '1rem' }}
            src={speciesImage}
            alt="Species image"
          />
        )}
      </Box>

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformation.distributionMapImage')}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          disabled={
            loadingSpeciesInformation || !nameValid || !shortDescriptionValid
          }
          onClick={saveSpeciesInformation}
          sx={{ minWidth: 150 }}
        >
          {id
            ? t('speciesInformation.buttons.update')
            : t('speciesInformation.buttons.create')}
        </Button>
      </Box>
    </div>
  );
};

export default SpeciesInformationEditor;
