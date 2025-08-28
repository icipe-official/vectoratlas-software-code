import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getPointData, getPointDataBySource, modifyFullPointData } from '../api/api';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

const ENTITY_OPTIONS = [
  'occurrence',
  'sample',
  'reference',
  'recordedSpecies',
  'site',
  'dataset',
  'bionomics',
  'insecticideResistanceBioassays',
  'rdl296GenotypeFrequencies',
] as const;

type EntityType = typeof ENTITY_OPTIONS[number];

const isPrimitive = (val: unknown): val is string | number | boolean | null =>
  typeof val === 'string' ||
  typeof val === 'number' ||
  typeof val === 'boolean' ||
  val === null;

const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';

const EditPointData: React.FC = () => {
  const [mode, setMode] = useState<'occurrence' | 'source'>('occurrence'); // NEW
  const [occurrenceId, setOccurrenceId] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [data, setData] = useState<any>(null);
  const [sourceRecords, setSourceRecords] = useState<any[]>([]); // for source mode
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const t = useTranslations('EditPointData');

  const fetchDataByOccurrence = async () => {
    if (!entityType || !occurrenceId) {
      toast.warning('Please enter an ID and select an entity type');
      return;
    }

    try {
      setLoading(true);
      const fetched = await getPointData(entityType, occurrenceId);
      setData(fetched);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDataBySource = async () => {
    if (!sourceId) {
      toast.warning('Please enter a source ID and select an entity type');
      return;
    }

    try {
      setLoading(true);
      const fetched = await getPointDataBySource(sourceId);
      if (Array.isArray(fetched)) {
        setSourceRecords(fetched);
      } else {
        setSourceRecords([fetched]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch source records');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecord = (record: any) => {
    // when user picks a record from source list
    setOccurrenceId(record.id?.toString() || '');
    setData(record);
    setMode('occurrence'); // switch back to edit mode
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (!data || !name) return;

    const parsedValue =
      value === 'true' ? true : value === 'false' ? false : value;

    if (Array.isArray(data)) {
      if (index === undefined) return;
      const updated = [...data];
      updated[index] = { ...updated[index], [name]: parsedValue };
      setData(updated);
    } else {
      setData({ ...data, [name]: parsedValue });
    }
  };

  const handleSave = async () => {
    if (!data || !entityType) {
      toast.warning('Missing data or entity type.');
      return;
    }

    try {
      setSaving(true);
      await modifyFullPointData(data[0] || data, entityType); // works for array or single
      toast.success('Data updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update data');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (key: string, value: unknown, index?: number) => {
    if (key === 'id' || !isPrimitive(value)) return null;

    if (isBoolean(value)) {
      return (
        <FormControl fullWidth margin="normal" key={key}>
          <InputLabel>{key}</InputLabel>
          <Select
            label={key}
            name={key}
            value={value.toString()}
            onChange={(e: any) => handleChange(e, index)}
          >
            <MenuItem value="true">true</MenuItem>
            <MenuItem value="false">false</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        key={key}
        label={key}
        name={key}
        value={value ?? ''}
        fullWidth
        margin="normal"
        onChange={(e) => handleChange(e, index)}
      />
    );
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Entity Point Data
      </Typography>

      {/* Toggle between Occurrence or Source */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant={mode === 'occurrence' ? 'contained' : 'outlined'}
          onClick={() => setMode('occurrence')}
        >
          By Occurrence ID
        </Button>
        <Button
          variant={mode === 'source' ? 'contained' : 'outlined'}
          onClick={() => setMode('source')}
        >
          By Source ID
        </Button>
      </Box>

      {/* MODE 1: Occurrence */}
      {mode === 'occurrence' && (
        <>
        <h4><span style={{color: "green"}}>Source Id:</span> {sourceId}</h4>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <TextField
            label="Occurrence ID"
            value={occurrenceId}
            onChange={(e) => setOccurrenceId(e.target.value)}
            fullWidth
            sx={{ flex: 1, minWidth: 250 }}
          />

          <Autocomplete<EntityType>
            options={ENTITY_OPTIONS}
            value={entityType}
            onChange={(_, newValue) => setEntityType(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Entity Type" fullWidth />
            )}
            sx={{ flex: 1, minWidth: 250 }}
          />

          <Button
            variant="contained"
            onClick={fetchDataByOccurrence}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
          </Button>
        </Box>
        </>
      )}

      {/* MODE 2: Source */}
      {mode === 'source' && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <TextField
            label="Source ID"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            fullWidth
            sx={{ flex: 1, minWidth: 250 }}
          />

          <Button
            variant="contained"
            onClick={fetchDataBySource}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Records'}
          </Button>
        </Box>
      )}

      {/* Source record list */}
      {mode === 'source' && sourceRecords.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Select a Record to Edit
          </Typography>
          {sourceRecords.map((rec, idx) => (
            <Box
              key={rec.id || idx}
              sx={{
                border: '1px solid #ddd',
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1">
                Record {idx + 1} (ID: {rec.id})
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => handleSelectRecord(rec)}
              >
                Edit This Record
              </Button>
            </Box>
          ))}
        </Box>
      )}
      

      {/* Edit Form */}
      {data && mode === 'occurrence' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Edit Fields
          </Typography>

          {Array.isArray(data)
            ? data.map((record, index) => (
                <Box
                  key={String(record['id']) || index}
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Record {index + 1}
                  </Typography>
                  {Object.entries(record).map(([key, value]) =>
                    renderField(key, value, index)
                  )}
                </Box>
              ))
            : Object.entries(data).map(([key, value]) =>
                renderField(key, value)
              )}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !data || !entityType}
            >
              {saving ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EditPointData;
