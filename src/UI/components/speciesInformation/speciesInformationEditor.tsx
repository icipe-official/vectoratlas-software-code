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
import { getSourceInfo } from '../../state/source/actions/getSourceInfo';
import { speciesList } from '../../state/map/utils/countrySpeciesLists';

const UPLOAD_LIMIT_IN_KB = 512;

type TextEditorProps = {
  description: string;
  initialDescription: string;
  setDescription: (d: string) => void;
  error?: boolean;
  helperText?: string;
};

const TextEditor = dynamic<TextEditorProps>(
  () =>
    import('../shared/textEditor/RichTextEditor').then((mod) => ({
      default: mod.TextEditor,
    })),
  { ssr: false }
);

type Subsection = {
  title: string;
  content: string;
};

const SpeciesInformationEditor = () => {
  const t = useTranslations('SpeciesPage');

  const [shortDescription, setShortDescription] = useState('');
  const [speciesImage, setSpeciesImage] = useState('');
  const [name, setName] = useState('');
  const [citationSearch, setCitationSearch] = useState('');
  const [selectedCitations, setSelectedCitations] = useState<any[]>([]);
  const [species, setSpecies] = useState('');
  const [link, setLink] = useState('');
  const sources = useAppSelector((state) => state.source.source_info);

  const [subsections, setSubsections] = useState<Subsection[]>([]);
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

  const citationIds = selectedCitations.map((c) => c.num_id);

  console.log('Selected citations:', selectedCitations); // 👈 Shows full objects
  console.log('Mapped citation IDs:', citationIds); // 👈 Should be [12, 45, etc.]

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
      citations: selectedCitations.map((c) => c.num_id),
      link: species,
    };

    dispatch(upsertSpeciesInformation(speciesInformation));
    toast.success('Species information saved!');
    setSubsections([]);
    setName('');
    setShortDescription('');
    setSpeciesImage('');
  }, [
    dispatch,
    id,

    name,
    shortDescription,
    speciesImage,
    subsections,
    selectedCitations,
    species,
  ]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size < UPLOAD_LIMIT_IN_KB * 1024) {
      const speciesImage = await toBase64(e.target.files[0]);
      setSpeciesImage(speciesImage);
    } else {
      const error = t('speciesInformationEditor.uploadImageFileHelperText', {
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
    dispatch(getSourceInfo());
  }, [dispatch]);

  useEffect(() => {
    console.log('All citations:', allCitations);
  }, [allCitations]);

  useEffect(() => {
    if (currentSpeciesInformation && sources.items?.length > 0) {
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
      setLink(currentSpeciesInformation.link);

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

  const nameValid = name !== '';
  const shortDescriptionValid = shortDescription !== '';

  const filteredCitations = allCitations.filter((citation) =>
    citation.article_title?.toLowerCase().includes(citationSearch.toLowerCase())
  );

  return (
    <div>
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
          shortDescription={shortDescription}
          setShortDescription={setShortDescription}
          initialShortDescription={shortDescription}
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
          disabled={loadingSpeciesInformation}
          variant="contained"
          component="label"
          sx={{ width: '50%', minWidth: '250px' }}
        >
          <UploadIcon />
          {t('speciesInformationEditor.uploadImageFile')}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        <Typography>
          {t('speciesInformationEditor.uploadImageFileHelperText', {
            maxSize: UPLOAD_LIMIT_IN_KB,
          })}
        </Typography>
        {speciesImage && (
          <picture>
            <img
              style={{ width: '30vw' }}
              src={speciesImage}
              alt="Species image"
            />
          </picture>
        )}
      </Box>

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Citation
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Search for citations"
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
            loadingSpeciesInformation || !nameValid || !shortDescriptionValid
          }
          onClick={saveSpeciesInformation}
          sx={{ minWidth: 150 }}
        >
          {id
            ? t('speciesInformationEditor.buttons.update')
            : t('speciesInformationEditor.buttons.create')}
        </Button>
      </div>
    </div>
  );
};

export default SpeciesInformationEditor;
