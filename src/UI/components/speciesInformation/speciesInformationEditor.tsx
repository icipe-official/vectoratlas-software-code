import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  Box,
  Autocomplete,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { useTranslations } from 'next-intl';
import { getSourceInfo } from '../../state/source/actions/getSourceInfo';
import { speciesList } from '../../state/map/utils/countrySpeciesLists';
import { TextEditor } from '../shared/textEditor/RichTextEditor';
import SpeciesImageViewer from '../species/SpeciesImageViewer';
import { uploadSpeciesImageAuthenticated } from '../../api/api';

const UPLOAD_LIMIT_IN_KB = 1024;

type Subsection = {
  title: string;
  content: string;
};

const SpeciesInformationEditor = () => {
  const t = useTranslations('SpeciesPage');

  const [shortDescription, setShortDescription] = useState('');
  const [speciesImage, setSpeciesImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [name, setName] = useState('');
  const [citationSearch, setCitationSearch] = useState('');
  const [selectedCitations, setSelectedCitations] = useState<any[]>([]);
  const [species, setSpecies] = useState('');
  const [link, setLink] = useState('');
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const sources = useAppSelector((state) => state.source.source_info);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const currentSpeciesInformation = useAppSelector(
    (s) => s.speciesInfo.currentInfoForEditing
  );
  const loadingSpeciesInformation = useAppSelector(
    (s) => s.speciesInfo.loading
  );
  const allCitations = useAppSelector((s) => s.source.source_info.items);

  const router = useRouter();
  const id = router.query.id as string | undefined;

  const saveSpeciesInformation = useCallback(async () => {
    const speciesInformation: SpeciesInformation = {
      id,
      name,
      shortDescription,
      description: JSON.stringify(subsections),
      speciesImage,
      previewImage,
      citations: selectedCitations.map((c) => c.num_id),
      link: species,
    };

    setSaving(true);
    const resultAction = await dispatch(
      upsertSpeciesInformation(speciesInformation)
    );
    setSaving(false);

    if (upsertSpeciesInformation.fulfilled.match(resultAction)) {
      setSubsections([]);
      setName('');
      setShortDescription('');
      setSpeciesImage('');
      setPreviewImage('');
    }
  }, [
    dispatch,
    id,
    name,
    shortDescription,
    speciesImage,
    previewImage,
    subsections,
    selectedCitations,
    species,
    token,
  ]);

  useEffect(() => {
    if (id) {
      dispatch(getSpeciesInformation(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getSourceInfo());
  }, [dispatch]);

  // Populate the core species fields as soon as the record loads —
  // this no longer waits on the citations list (sources.items).
  useEffect(() => {
    if (currentSpeciesInformation) {
      setName(currentSpeciesInformation.name);
      setShortDescription(currentSpeciesInformation.shortDescription);
      try {
        setSubsections(
          JSON.parse(currentSpeciesInformation.description || '[]')
        );
      } catch {
        setSubsections([]);
      }
      setSpeciesImage(currentSpeciesInformation.speciesImage);
      setPreviewImage(currentSpeciesInformation.previewImage);
      setLink(currentSpeciesInformation.link);
    }
  }, [currentSpeciesInformation]);

  // Citation matching still depends on the sources list being loaded,
  // so it stays in its own effect, separate from the fields above.
  useEffect(() => {
    if (currentSpeciesInformation && sources.items?.length > 0) {
      const rawCitations: string = currentSpeciesInformation.citations[0];

      const citationIds =
        typeof rawCitations === 'string'
          ? rawCitations
              .split(',')
              .map((id: any) => parseInt(id.trim(), 10))
              .filter((n: any) => !isNaN(n))
          : [];

      const matchedCitations = sources.items.filter((source) =>
        citationIds.includes(source.num_id)
      );

      setSelectedCitations(matchedCitations);
    }
  }, [currentSpeciesInformation, sources.items]);

  if (loadingSpeciesInformation) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  const citationIds = selectedCitations.map((c) => c.num_id);

  const handleBack = () => {
    router.push('/species');
  };

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

  // Uploads a JPEG species image. The backend no longer stores this
  // anywhere external (no Azure) — it just validates the file, generates
  // a WebP preview, and hands back both as base64 strings. Those base64
  // strings are held here in local state and only actually persisted
  // when the form is submitted via saveSpeciesInformation, which sends
  // them to createEditSpeciesInformation to be decoded and saved
  // directly into the species_information table's bytea columns.
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Only JPEG is accepted here, matching what the backend expects.
    if (file.type !== 'image/jpeg') {
      toast.error('Please upload a JPEG image.');
      return;
    }

    if (file.size >= UPLOAD_LIMIT_IN_KB * 1024) {
      const error = t('speciesInformationEditor.uploadImageFileHelperText', {
        maxSize: UPLOAD_LIMIT_IN_KB,
      });

      toast.error(error, {
        autoClose: 5000,
      });
      return;
    }

    try {
      setUploadingImage(true);
      const result = await uploadSpeciesImageAuthenticated(
        file,
        token?.toString()
      );
      setSpeciesImage(result.imageBase64);
      setPreviewImage(result.previewBase64);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const nameValid = name !== '';
  const shortDescriptionValid = shortDescription !== '';

  const filteredCitations = allCitations.filter((citation) =>
    citation.article_title?.toLowerCase().includes(citationSearch.toLowerCase())
  );

  return (
    <div>
      <Button
        variant="contained"
        color="inherit"
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        <ArrowBackIcon sx={{ marginRight: 1 }} />
        {t('buttons.back')}
      </Button>

      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        {id
          ? t('speciesInformationEditor.edit')
          : t('speciesInformationEditor.create')}
      </Typography>

      {loadingSpeciesInformation && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformationEditor.name')}
      </Typography>
      <TextField
        disabled={loadingSpeciesInformation}
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!nameValid}
        helperText={
          !nameValid ? t('speciesInformationEditor.nameHelperText') : ''
        }
      />

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformationEditor.shortDescription')}
      </Typography>
      {!loadingSpeciesInformation ? (
        <ShortTextEditor
          key={
            id
              ? `${id}-${currentSpeciesInformation ? 'loaded' : 'pending'}`
              : 'new'
          }
          shortDescription={
            currentSpeciesInformation?.shortDescription ?? shortDescription
          }
          setShortDescription={setShortDescription}
          initialShortDescription={
            currentSpeciesInformation?.shortDescription ?? shortDescription
          }
          error={!shortDescriptionValid}
          helperText={
            !shortDescriptionValid
              ? t('speciesInformationEditor.shortDescriptionHelperText')
              : undefined
          }
        />
      ) : (
        <div style={{ height: 150 }} />
      )}

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformationEditor.fullDescription')}
      </Typography>

      {subsections.map((subsection, index) => (
        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
          <TextField
            label={`Subsection ${index + 1} Title`}
            variant="outlined"
            fullWidth
            value={subsection.title}
            onChange={(e) => updateSubsection(index, 'title', e.target.value)}
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
        {t('speciesInformationEditor.image')}
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Button
          disabled={loadingSpeciesInformation || uploadingImage}
          variant="contained"
          component="label"
          sx={{ width: '50%', minWidth: '250px' }}
        >
          <UploadIcon />
          {uploadingImage
            ? 'Uploading...'
            : t('speciesInformationEditor.uploadImageFile')}
          <input
            type="file"
            hidden
            accept="image/jpeg"
            onChange={handleImageUpload}
          />
        </Button>
        <Typography>
          {t('speciesInformationEditor.uploadImageFileHelperText', {
            maxSize: UPLOAD_LIMIT_IN_KB,
          })}
        </Typography>
        {previewImage && (
          <SpeciesImageViewer
            previewRef={previewImage}
            downloadRef={speciesImage}
            alt="Species image"
            speciesName={name}
          />
        )}
      </Box>

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('speciesInformationEditor.citation')}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label={t('speciesInformationEditor.citation')}
        value={citationSearch}
        onChange={(e) => setCitationSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {citationSearch && (
        <div>
          {filteredCitations.length > 0 ? (
            filteredCitations.map((citation) => (
              <div
                key={citation.num_id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <div>
                  <Typography variant="body1" fontWeight="normal">
                    {citation.num_id}: {citation.article_title}
                  </Typography>
                  <Typography variant="body2" fontStyle={'italic'}>
                    {citation.citation}
                  </Typography>
                </div>
                <Button
                  onClick={() => {
                    if (
                      !selectedCitations.some(
                        (c) =>
                          c.num_id === citation.num_id &&
                          c.article_title === citation.article_title
                      )
                    ) {
                      setSelectedCitations([...selectedCitations, citation]);
                    }
                  }}
                  variant="outlined"
                >
                  Add
                </Button>
              </div>
            ))
          ) : (
            <Typography>No matching citations found.</Typography>
          )}
        </div>
      )}

      {selectedCitations.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Typography variant="h6">Selected Citations</Typography>
          {selectedCitations.map((citation) => (
            <div
              key={citation.num_id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderBottom: '1px dashed #ccc',
              }}
            >
              <div>
                <Typography variant="body2" fontWeight="normal">
                  ID: {citation.num_id}
                </Typography>
                <Typography variant="body1" fontWeight="normal">
                  {citation.num_id}: {citation.article_title}
                </Typography>
              </div>
              <Button
                color="error"
                onClick={() =>
                  setSelectedCitations((prev) =>
                    prev.filter((c) => c.num_id !== citation.num_id)
                  )
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      <Typography color="primary" variant="h5" sx={{ mt: 4, mb: 1 }}>
        Link Generation
      </Typography>
      <Autocomplete
        options={speciesList}
        value={species}
        onChange={(_, newValue) => setSpecies(newValue || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search or select a species"
            variant="outlined"
            fullWidth
          />
        )}
        getOptionLabel={(option) => option}
        isOptionEqualToValue={(option, value) => option === value}
      />

      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}
      >
        <Button
          variant="contained"
          disabled={
            loadingSpeciesInformation ||
            saving ||
            !nameValid ||
            !shortDescriptionValid
          }
          onClick={saveSpeciesInformation}
          sx={{ minWidth: 150 }}
        >
          {saving
            ? '...'
            : id
            ? t('speciesInformationEditor.buttons.update')
            : t('speciesInformationEditor.buttons.create')}
        </Button>
      </div>
    </div>
  );
};

export default SpeciesInformationEditor;
