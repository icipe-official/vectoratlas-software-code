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
  Divider,
  Grid, 
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

const DOMINANT_SPECIES = [
  'arabiensis', 'funestus', 'funestus complex', 'gambiae complex', 
  'gambiae_s form', 'coluzzii_gambiae_m form', 'stephensi'
];

const SpeciesInformationEditor = () => {
  const t = useTranslations('SpeciesPage');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const [shortDescription, setShortDescription] = useState('');
  const [speciesImage, setSpeciesImage] = useState('');
  const [name, setName] = useState('');
  const [citationSearch, setCitationSearch] = useState('');
  const [selectedCitations, setSelectedCitations] = useState<any[]>([]); // This type can remain as any[] if the backend source type is complex
  const [speciesLink, setSpeciesLink] = useState('');
  const [subsections, setSubsections] = useState<Subsection[]>([]);

  const currentSpeciesInformation = useAppSelector((s) => s.speciesInfo.currentInfoForEditing);
  const loadingSpeciesInformation = useAppSelector((s) => s.speciesInfo.loading);
  const allCitations = useAppSelector((s) => s.source.source_info.items);
  const sources = useAppSelector((state) => state.source.source_info);

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

  const handleAddSubsection = () => setSubsections([...subsections, { title: '', content: '' }]);
  const handleRemoveSubsection = (index: number) => setSubsections(subsections.filter((_, i) => i !== index));
  
  const updateSubsection = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...subsections];
    updated[index][field] = value;
    setSubsections(updated);
  };

  const saveSpeciesInformation = useCallback(() => {
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
    toast.success('Species saved successfully');
    router.push('/species');
  }, [dispatch, id, name, shortDescription, speciesImage, subsections, selectedCitations, speciesLink, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size < UPLOAD_LIMIT_IN_KB * 1024) {
      const base64 = await toBase64(e.target.files[0]);
      setSpeciesImage(base64 as string);
    } else {
      toast.error(t('speciesInformationEditor.uploadImageFileHelperText', { maxSize: UPLOAD_LIMIT_IN_KB }));
    }
  };

  const filteredCitations = allCitations?.filter((c) =>
    c.article_title?.toLowerCase().includes(citationSearch.toLowerCase())
  ) || [];

  const isDominant = DOMINANT_SPECIES.includes(name.toLowerCase().trim());

  return (
    <Box sx={{ p: 4, maxWidth: '1000px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>{id ? 'Edit Species' : 'Create New Species'}</Typography>
      {loadingSpeciesInformation && <CircularProgress sx={{ mb: 2 }} />}

      <Box sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 2, bgcolor: isDominant ? '#fff9c4' : '#f5f5f5' }}>
        <Typography variant="h6" color="primary">Species Identity</Typography>
        <TextField
          fullWidth
          label="Species Name (e.g. arabiensis)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2, mb: 1 }}
        />
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          Status: {isDominant ? "PRIMARY (Dominant - Bright Colors / Ring)" : "SECONDARY (Muted / Dot)"}
        </Typography>
      </Box>

      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>Brief Summary</Typography>
      <ShortTextEditor
        shortDescription={shortDescription}
        setShortDescription={setShortDescription}
        initialShortDescription={shortDescription}
      />

      <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 1 }}>Full Detailed Sections</Typography>
      {subsections.map((sub, index) => (
        <Box key={index} sx={{ border: '1px solid #eee', p: 3, mb: 2, borderRadius: 2 }}>
          <TextField
            label="Section Title (e.g. Ecology)"
            fullWidth
            value={sub.title}
            onChange={(e) => updateSubsection(index, 'title', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextEditor
            description={sub.content}
            setDescription={(val) => updateSubsection(index, 'content', val)}
            initialDescription={sub.content}
          />
          <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveSubsection(index)}>Remove Section</Button>
        </Box>
      ))}
      <Button variant="outlined" onClick={handleAddSubsection} sx={{ mb: 4 }}>+ Add New Section</Button>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" color="primary">Visuals & Mapping</Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={6}>
            <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                Upload Photo
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            {speciesImage && <img src={speciesImage} alt="Preview" style={{ width: '100%', marginTop: 10, borderRadius: 8 }} />}
        </Grid>
        <Grid item xs={6}>
            <Autocomplete
                options={mapSpeciesOptions}
                value={speciesLink}
                onChange={(_, val) => setSpeciesLink(val || '')}
                renderInput={(params) => <TextField {...params} label="Link to Map Data" />}
            />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 2, border: '1px solid #eee' }}>
        <Typography variant="h6" color="primary">Citations</Typography>
        <TextField
            fullWidth
            placeholder="Search database for citations..."
            value={citationSearch}
            onChange={(e) => setCitationSearch(e.target.value)}
            sx={{ mb: 2 }}
        />
        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {citationSearch && filteredCitations.map(cit => (
                <Box key={cit.num_id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2">{cit.article_title}</Typography>
                    <Button size="small" onClick={() => setSelectedCitations([...selectedCitations, cit])}>Add</Button>
                </Box>
            ))}
        </Box>
        <Box sx={{ mt: 2 }}>
            {selectedCitations.map(sc => (
                <Box key={sc.num_id} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#e3f2fd', p: 1, m: 0.5, borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ flexGrow: 1 }}>{sc.article_title}</Typography>
                    <IconButton size="small" onClick={() => setSelectedCitations(selectedCitations.filter(c => c.num_id !== sc.num_id))}><DeleteIcon fontSize="inherit" /></IconButton>
                </Box>
            ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6, gap: 2 }}>
        <Button variant="text" onClick={() => router.push('/species')}>Cancel</Button>
        <Button variant="contained" size="large" onClick={saveSpeciesInformation} disabled={!name}>
          Save Species Data
        </Button>
      </Box>
    </Box>
  );
};

export default SpeciesInformationEditor;