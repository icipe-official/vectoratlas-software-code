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
import { speciesList as mapSpeciesOptions } from '../../state/map/utils/countrySpeciesLists';
import { TextEditor } from '../shared/textEditor/RichTextEditor';

const UPLOAD_LIMIT_IN_KB = 512;

type Subsection = {
  title: string;
  content: string;
};

const SpeciesInformationEditor = () => {
  const t = useTranslations('SpeciesPage');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const [shortDescription, setShortDescription] = useState('');
  const [speciesImage, setSpeciesImage] = useState('');
  const [name, setName] = useState('');
  const [citationSearch, setCitationSearch] = useState('');
  const [selectedCitations, setSelectedCitations] = useState<any[]>([]);
  const [speciesLink, setSpeciesLink] = useState('');
  const [subsections, setSubsections] = useState<Subsection[]>([]);

  const currentSpeciesInformation = useAppSelector((s) => s.speciesInfo.currentInfoForEditing);
  const loadingSpeciesInformation = useAppSelector((s) => s.speciesInfo.loading);
  const allCitations = useAppSelector((s) => s.source.source_info.items);
  const sources = useAppSelector((state) => state.source.source_info);

  const handleAddSubsection = () => setSubsections([...subsections, { title: '', content: '' }]);
  const handleRemoveSubsection = (index: number) => setSubsections(subsections.filter((_, i) => i !== index));
  const updateSubsection = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...subsections];
    updated[index][field] = value;
    setSubsections(updated);
  };

  const saveSpeciesInformation = useCallback(() => {
    // Marianne's Requirement: Ensure prefaced with 'An.'
    const formattedName = name.trim().startsWith('An.') ? name.trim() : `An. ${name.trim()}`;

    const speciesInformation: SpeciesInformation = {
      id,
      name: formattedName,
      shortDescription,
      description: JSON.stringify(subsections),
      speciesImage,
      citations: selectedCitations.map((c) => c.num_id),
      link: speciesLink,
    };

    dispatch(upsertSpeciesInformation(speciesInformation));
    toast.success('Species information saved!');
    router.push('/species'); 
  }, [dispatch, id, name, shortDescription, speciesImage, subsections, selectedCitations, speciesLink, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size < UPLOAD_LIMIT_IN_KB * 1024) {
      const base64 = await toBase64(e.target.files[0]);
      setSpeciesImage(base64);
    } else {
      toast.error(t('speciesInformationEditor.uploadImageFileHelperText', { maxSize: UPLOAD_LIMIT_IN_KB }));
    }
  };

  useEffect(() => {
    if (id) dispatch(getSpeciesInformation(id));
    dispatch(getSourceInfo());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSpeciesInformation && sources.items?.length > 0) {
      setName(currentSpeciesInformation.name.replace(/^An\.\s?/, ''));
      setShortDescription(currentSpeciesInformation.shortDescription);
      setSpeciesImage(currentSpeciesInformation.speciesImage);
      setSpeciesLink(currentSpeciesInformation.link);
      try {
        setSubsections(JSON.parse(currentSpeciesInformation.description || '[]'));
      } catch {
        setSubsections([]);
      }
      const rawCits = currentSpeciesInformation.citations[0];
      const citationIds = typeof rawCits === 'string' 
        ? rawCits.split(',').map(i => parseInt(i.trim())).filter(n => !isNaN(n)) 
        : [];
      setSelectedCitations(sources.items.filter(s => citationIds.includes(s.num_id)));
    }
  }, [currentSpeciesInformation, sources.items]);

  const filteredCitations = allCitations.filter((c) =>
    c.article_title?.toLowerCase().includes(citationSearch.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {id ? t('speciesInformationEditor.edit') : t('speciesInformationEditor.create')}
      </Typography>

      {loadingSpeciesInformation && <CircularProgress />}

      <Typography color="primary" variant="h5">Species Name (Prefixed with An.)</Typography>
      <TextField
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. arabiensis"
        sx={{ mb: 3 }}
      />

      <Typography color="primary" variant="h5">Short Description</Typography>
      <ShortTextEditor
        shortDescription={shortDescription}
        setShortDescription={setShortDescription}
        initialShortDescription={shortDescription}
      />

      <Typography color="primary" variant="h5" sx={{ mt: 3 }}>Full Description Sections</Typography>
      {subsections.map((sub, index) => (
        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
          <TextField
            label="Subsection Title"
            fullWidth
            value={sub.title}
            onChange={(e) => updateSubsection(index, 'title', e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextEditor
            description={sub.content}
            setDescription={(val) => updateSubsection(index, 'content', val)}
            initialDescription={sub.content}
          />
          <IconButton color="error" onClick={() => handleRemoveSubsection(index)}><DeleteIcon /></IconButton>
        </Box>
      ))}
      <Button onClick={handleAddSubsection} variant="outlined">+ Add Subsection</Button>

      <Typography color="primary" variant="h5" sx={{ mt: 3 }}>Species Image</Typography>
      <Button variant="contained" component="label" startIcon={<UploadIcon />}>
        Upload Image <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
      </Button>
      {speciesImage && <img src={speciesImage} style={{ width: '200px', display: 'block', marginTop: 10, borderRadius: '4px' }} />}

      <Typography color="primary" variant="h5" sx={{ mt: 3 }}>Citations</Typography>
      <TextField
        fullWidth
        label="Search for citations"
        value={citationSearch}
        onChange={(e) => setCitationSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {citationSearch && (
        <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #eee', p: 1, mb: 2 }}>
          {filteredCitations.map((citation) => (
            <Box key={citation.num_id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, p: 1, borderBottom: '1px solid #f5f5f5' }}>
              <Typography variant="body2">{citation.article_title}</Typography>
              <Button size="small" onClick={() => {
                if (!selectedCitations.find(c => c.num_id === citation.num_id)) {
                    setSelectedCitations([...selectedCitations, citation]);
                }
              }}>Add</Button>
            </Box>
          ))}
        </Box>
      )}

      {selectedCitations.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Selected:</Typography>
          {selectedCitations.map((c) => (
            <Box key={c.num_id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption">• {c.article_title}</Typography>
              <IconButton size="small" onClick={() => setSelectedCitations(selectedCitations.filter(sc => sc.num_id !== c.num_id))}>
                <DeleteIcon fontSize="inherit" color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Typography color="primary" variant="h5" sx={{ mt: 3 }}>Map Link Species</Typography>
      <Autocomplete
        options={mapSpeciesOptions}
        value={speciesLink}
        onChange={(_, val) => setSpeciesLink(val || '')}
        renderInput={(params) => <TextField {...params} label="Select Species for Map Link" />}
        sx={{ mb: 4 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 4 }}>
        <Button
          variant="contained"
          size="large"
          disabled={!name || !shortDescription}
          onClick={saveSpeciesInformation}
          sx={{ minWidth: 150 }}
        >
          {id ? t('speciesInformationEditor.buttons.update') : t('speciesInformationEditor.buttons.create')}
        </Button>
      </Box>
    </Box>
  );
};

export default SpeciesInformationEditor;