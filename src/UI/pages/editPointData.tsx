import React, { useEffect, useState } from 'react';
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
  Container,
} from '@mui/material';
import {
  getPointData,
  getPointDataBySource,
  modifyFullPointData,
} from '../api/api';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';
import { useSelector } from 'react-redux';
import { AppState } from '../state/store';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import AuthWrapper from '../components/shared/AuthWrapper';
import { RolesEnum } from '../state/state.types';

const ENTITY_OPTIONS = [
  'Larval_site',
  'ace1AlleleFrequencies',
  'ace1GenotypeFrequencies',
  'ace1MethodAndSample',
  'anthropo_zoophagic',
  'biology',
  'bionomics',
  'biting_activity',
  'biting_rate',
  'cyp4j5AlleleFrequencies',
  'cyp4j5GenotypeFrequencies',
  'cyp6aapAlleleFrequencies',
  'cyp6aapGenotypeFrequencies',
  'cyp6p4AlleleFrequencies',
  'cyp6p4GenotypeFrequencies',
  'cytochromesP450_cypMethodAndSample',
  'dataset',
  'endo_exophagic',
  'endo_exophily',
  'environment',
  'genotypicRepresentativeness',
  'gste2_114AlleleFrequencies',
  'gste2_114GenotypeFrequencies',
  'gste2_119AlleleFrequencies',
  'gste2_119GenotypeFrequencies',
  'gsteMethodAndSample',
  'infection',
  'insecticideResistanceBioassays',
  'kdrGenotypeFrequencies',
  'occurrence',
  'rdl296AlleleFrequencies',
  'rdl296GenotypeFrequencies',
  'rdlMethodAndSample',
  'recorded_species',
  'reference',
  'sample',
  'site',
  'uploaded_dataset',
  'vgsc1570AlleleFrequencies',
  'vgsc1570GenotypeFrequencies',
  'vgsc402AlleleFrequencies',
] as const;

type EntityType = (typeof ENTITY_OPTIONS)[number];

const isPrimitive = (val: unknown): val is string | number | boolean | null =>
  typeof val === 'string' ||
  typeof val === 'number' ||
  typeof val === 'boolean' ||
  val === null;

const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';

const EditPointData: React.FC = () => {
  const [mode, setMode] = useState<'occurrence' | 'source'>('occurrence');
  const [occurrenceId, setOccurrenceId] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [data, setData] = useState<any>(null);
  const [sourceRecords, setSourceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const t = useTranslations('EditPointData');
  const token = useSelector((state: AppState) => state.auth.token);
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [reasonForEdit, setReasonForEdit] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCurrentUser({ name: data.name, email: data.email });
      } catch (err) {
        console.error('Failed to fetch current user', err);
      }
    };

    if (token) fetchCurrentUser();
  }, [token]);

  // 🔹 Load data passed from the Edit button
  useEffect(() => {
    const stored = sessionStorage.getItem('editData');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.occurrenceId) setOccurrenceId(parsed.occurrenceId);
      if (parsed.entityType) setEntityType(parsed.entityType);
    }
  }, []);

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
    setOccurrenceId(record.id?.toString() || '');
    setData(record);
    setMode('occurrence');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (!data || !name) return;

    // convert values properly
    let parsedValue: any = value;
    if (value === 'true') parsedValue = true;
    else if (value === 'false') parsedValue = false;
    else if (!isNaN(Number(value)) && value !== '') parsedValue = Number(value);

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
      const { value: reason } = await Swal.fire({
        title: 'Reason for Edit',
        input: 'textarea',
        inputLabel: 'Please enter a reason for editing this record:',
        inputPlaceholder:
          'e.g., Corrected mislabelled coordinates or updated field data',
        inputAttributes: {
          'aria-label': 'Reason for editing',
          style:
            'min-height: 120px; width: 90%; resize: vertical; font-size: 15px; padding: 10px;',
        },
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        customClass: {
          popup: 'swal2-large-popup',
        },
        inputValidator: (value: any) => {
          if (!value) {
            return 'You must provide a reason before proceeding!';
          }
          return null;
        },
      });

      if (!reason) {
        return;
      }

      setReasonForEdit(reason);

      const confirmResult = await Swal.fire({
        title: 'Check Related Records?',
        text: 'There might be other records with the same Source ID that also need updates. Continue saving this one?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, continue',
        confirmButtonColor: '#28a745',
        cancelButtonText: 'Cancel',
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      setSaving(true);
      await modifyFullPointData(
        data[0] || data,
        entityType,
        currentUser,
        reason
      );

      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully',
        text: 'The record has been updated successfully.',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update data. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (key: string, value: unknown, index?: number) => {
    if (key === 'id' || !isPrimitive(value)) return null;

    if (
      isBoolean(value) ||
      (typeof value === 'string' &&
        (value.toLowerCase() === 'true' || value.toLowerCase() === 'false'))
    ) {
      return (
        <FormControl fullWidth margin="normal" key={key}>
          <InputLabel id={`${key}-label`}>{key}</InputLabel>
          <Select
            labelId={`${key}-label`}
            name={key}
            value={String(value).toLowerCase() === 'true' ? 'true' : 'false'}
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
        onChange={(e: any) => handleChange(e, index)}
      />
    );
  };

  const handleViewLogs = () => {
    router.push('/editLogsViewer');
  };

  return (
    <main>
      <Container
        sx={{
          padding: '10px',
          maxWidth: '75%',
        }}
      >
        <AuthWrapper role={RolesEnum.EDITOR}>
          <>
            <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
              <Typography variant="h4" gutterBottom>
                Edit Point Data
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
                <Button
                  variant={mode === 'source' ? 'contained' : 'outlined'}
                  onClick={handleViewLogs}
                >
                  See Logs
                </Button>
              </Box>

              {/* MODE 1: Occurrence */}
              {mode === 'occurrence' && (
                <>
                  <h4>
                    <span style={{ color: 'green' }}>Source Id:</span>{' '}
                    {sourceId}
                  </h4>
                  <Box
                    sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}
                  >
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
                      onChange={(_: any, newValue: any) =>
                        setEntityType(newValue)
                      }
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          label="Select Dataset Section"
                          fullWidth
                        />
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
                    onChange={(e: any) => setSourceId(e.target.value)}
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
                  {sourceRecords.map((rec: any, idx: any) => (
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

                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
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
          </>
        </AuthWrapper>
      </Container>
    </main>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default EditPointData;
