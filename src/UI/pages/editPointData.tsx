import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
  Container,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import {
  getPointData,
  getPointDataBySource,
  modifyFullPointData,
} from '../api/api';
import { toast } from 'react-toastify';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';
import { useSelector } from 'react-redux';
import { AppState } from '../state/store';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useSpeciesDb } from '../components/shared/useSpeciesDb';
import { useReferenceDb } from '../components/shared/useReferenceDb';
import OccurrenceCard from '../components/editPointData/OccurrenceCard';
import InsecticideResistanceCard from '../components/editPointData/InsecticideResistanceCard';
import BionomicsCard from '../components/editPointData/BionomicsCard';
import AuthWrapper from '../components/shared/AuthWrapper';
import { RolesEnum } from '../state/state.types';

const OCCURRENCE_TABLES = ['occurrence'] as const;
const BIONOMICS_TABLES = ['bionomics'] as const;
const IR_TABLES = ['insecticideResistanceBioassays'] as const;

const ALL_ENTITIES = [...OCCURRENCE_TABLES, ...BIONOMICS_TABLES, ...IR_TABLES];
type EntityType = (typeof ALL_ENTITIES)[number];

const EditPointData: React.FC = () => {
  const [mode, setMode] = useState<'occurrence' | 'source'>('occurrence');
  const [tabIndex, setTabIndex] = useState(0);
  const [occurrenceId, setOccurrenceId] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [entityType, setEntityType] = useState<EntityType | null>('occurrence');

  const [data, setData] = useState<any>(null);
  const [sourceRecords, setSourceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = useSelector((state: AppState) => state.auth.token);
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    email?: string;
  }>({});
  const router = useRouter();

  const speciesList = useSpeciesDb(true);
  const referenceList = useReferenceDb(true);

  // Fetch logged-in user for audit trails
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await res.json();
        setCurrentUser({ name: userData.name, email: userData.email });
      } catch (err) {}
    };
    if (token) fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    const stored = sessionStorage.getItem('editData');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.occurrenceId) setOccurrenceId(parsed.occurrenceId);

      if (parsed.entityType) {
        setEntityType(parsed.entityType);
        if (OCCURRENCE_TABLES.includes(parsed.entityType)) setTabIndex(0);
        else if (BIONOMICS_TABLES.includes(parsed.entityType)) setTabIndex(1);
        else if (IR_TABLES.includes(parsed.entityType)) setTabIndex(2);
      }

      if (parsed.occurrenceId && parsed.entityType) {
        setLoading(true);
        getPointData(parsed.entityType, parsed.occurrenceId)
          .then((fetched) => setData(fetched))
          .catch(() => toast.error('Failed to auto-fetch data'))
          .finally(() => setLoading(false));
      }
    }
  }, []);

  // Tying the active Tab directly to the Database Query
  const handleTabChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabIndex(newValue);
    setData(null);

    let targetEntity: EntityType = 'occurrence';
    if (newValue === 0) targetEntity = 'occurrence';
    if (newValue === 1) targetEntity = 'bionomics';
    if (newValue === 2) targetEntity = 'insecticideResistanceBioassays';

    setEntityType(targetEntity);

    if (!occurrenceId) return;

    setLoading(true);
    try {
      const fetched = await getPointData(targetEntity, occurrenceId);
      setData(fetched);
    } catch (err) {
      toast.error(`Failed to fetch ${targetEntity} data`);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataByOccurrence = async () => {
    if (!occurrenceId) return toast.warning('Please enter an Occurrence ID');

    let targetEntity: EntityType = 'occurrence';
    if (tabIndex === 0) targetEntity = 'occurrence';
    if (tabIndex === 1) targetEntity = 'bionomics';
    if (tabIndex === 2) targetEntity = 'insecticideResistanceBioassays';

    setEntityType(targetEntity);

    try {
      setLoading(true);
      const fetched = await getPointData(targetEntity, occurrenceId);
      setData(fetched);
    } catch (err) {
      toast.error(`Failed to fetch ${targetEntity} data`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataBySource = async () => {
    if (!sourceId) return toast.warning('Please enter a Source ID');
    try {
      setLoading(true);
      const fetched = await getPointDataBySource(sourceId);
      setSourceRecords(Array.isArray(fetched) ? fetched : [fetched]);
    } catch (err) {
      toast.error('Failed to fetch source records');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecord = (record: any) => {
    setOccurrenceId(record.id?.toString() || '');
    setData(record);
    setMode('occurrence');
    setEntityType('occurrence');
    setTabIndex(0);
  };

  const handleChange = (e: any, index?: number) => {
    const { name, value } = e.target;
    if (!data || !name) return;

    let parsedValue: any = value;
    if (value === 'true') parsedValue = true;
    else if (value === 'false') parsedValue = false;
    else if (!isNaN(Number(value)) && value !== '' && typeof value === 'string')
      parsedValue = Number(value);

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
    if (!data || !entityType)
      return toast.warning('Missing data or entity type.');
    try {
      const { value: reason } = await Swal.fire({
        title: 'Reason for Edit',
        input: 'textarea',
        inputPlaceholder:
          'e.g., Corrected mislabelled coordinates or updated field data',
        showCancelButton: true,
        inputValidator: (value) =>
          !value ? 'You must provide a reason before proceeding!' : null,
      });
      if (!reason) return;

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
        text: 'The record has been updated.',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update data. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const hasDataToSave =
    data &&
    (Array.isArray(data)
      ? Object.keys(data[0] || {}).length > 0
      : Object.keys(data).length > 0);

  return (
    <main>
      <Container
        maxWidth={false}
        sx={{
          // Phones: 20px sides to match the other pages. sm+: original 20px
          padding: { xs: '0 20px 8px', sm: '20px' },
          // Full width on phones, original 80% from md up
          maxWidth: { xs: '100%', md: '80%' },
        }}
      >
        <AuthWrapper role={RolesEnum.EDITOR}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.6rem', sm: '2.125rem' },
                  }}
                >
                  Edit Point Data
                </Typography>
                {loading && <CircularProgress size={24} />}
              </Box>

              {/* MODE TOGGLES: equal-width pair on phones, See Logs on its own line */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  mb: 3,
                  alignItems: 'center',
                }}
              >
                <Button
                  variant={mode === 'occurrence' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setMode('occurrence');
                    setData(null);
                  }}
                  sx={{
                    flex: { xs: '1 1 0', sm: '0 0 auto' },
                    minWidth: 0,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    lineHeight: 1.3,
                    py: 1,
                  }}
                >
                  By Occurrence ID
                </Button>
                <Button
                  variant={mode === 'source' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setMode('source');
                    setData(null);
                  }}
                  sx={{
                    flex: { xs: '1 1 0', sm: '0 0 auto' },
                    minWidth: 0,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    lineHeight: 1.3,
                    py: 1,
                  }}
                >
                  By Source ID
                </Button>
                <Button
                  variant="text"
                  onClick={() => router.push('/editLogsViewer')}
                  sx={{ flexBasis: { xs: '100%', sm: 'auto' } }}
                >
                  See Logs
                </Button>
              </Box>

              {/* DOMAIN TABS: fixed tab width on phones so labels don't clip */}
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, mt: 2 }}
              >
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    '& .MuiTab-root': {
                      minWidth: { xs: 110, sm: 160 },
                      px: { xs: 1, sm: 2 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    },
                  }}
                >
                  <Tab label="Occurrence" />
                  <Tab label="Bionomics" />
                  <Tab label="Insecticide Resistance" />
                </Tabs>
              </Box>

              {/* OCCURRENCE SEARCH */}
              {mode === 'occurrence' && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    p: { xs: 1.5, sm: 2 },
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                  }}
                >
                  <TextField
                    label="Occurrence ID"
                    value={occurrenceId}
                    onChange={(e) => setOccurrenceId(e.target.value)}
                    fullWidth
                    sx={{ flex: 1, minWidth: 0, bgcolor: 'white' }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    onClick={fetchDataByOccurrence}
                    disabled={loading || !occurrenceId}
                    sx={{ flexShrink: 0 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Fetch Data'
                    )}
                  </Button>
                </Box>
              )}

              {/* SOURCE SEARCH */}
              {mode === 'source' && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    p: { xs: 1.5, sm: 2 },
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                  }}
                >
                  <TextField
                    label="Source ID"
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    fullWidth
                    sx={{ flex: 1, minWidth: 0, bgcolor: 'white' }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    onClick={fetchDataBySource}
                    disabled={loading}
                    sx={{ flexShrink: 0 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Fetch Records'
                    )}
                  </Button>
                </Box>
              )}

              {/* SOURCE RECORD LIST */}
              {mode === 'source' && sourceRecords.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
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
                      <Typography>
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

              {/* CARD COMPONENTS RENDERING: one card at a time, constrained to the card width */}
              <Box sx={{ mt: 4, width: '100%', minWidth: 0 }}>
                {data && tabIndex === 0 && (
                  <OccurrenceCard
                    data={Array.isArray(data) ? data[0] || {} : data}
                    onChange={(e) =>
                      handleChange(e, Array.isArray(data) ? 0 : undefined)
                    }
                    speciesList={speciesList}
                    referenceList={referenceList}
                  />
                )}

                {data && tabIndex === 1 && (
                  <BionomicsCard
                    data={Array.isArray(data) ? data[0] || {} : data}
                    onChange={(e) =>
                      handleChange(e, Array.isArray(data) ? 0 : undefined)
                    }
                  />
                )}

                {data && tabIndex === 2 && (
                  <InsecticideResistanceCard
                    data={Array.isArray(data) ? data[0] || {} : data}
                    onChange={(e) =>
                      handleChange(e, Array.isArray(data) ? 0 : undefined)
                    }
                  />
                )}
              </Box>

              {hasDataToSave && (
                <Box
                  sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleSave}
                    disabled={saving || !entityType}
                    fullWidth
                    sx={{ maxWidth: { xs: '100%', sm: 220 } }}
                  >
                    {saving ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </AuthWrapper>
      </Container>
    </main>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default EditPointData;
