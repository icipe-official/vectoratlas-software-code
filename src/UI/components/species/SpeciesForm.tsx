import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { useAppSelector } from '../../state/hooks';

interface SpeciesItem {
  id: string;
  species: string;
  displayName: string;
  category: 'Primary' | 'Secondary';
  color: string;
}

export const SpeciesForm: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const t = useTranslations('cataloguePage');

  const token = useAppSelector((state) => state.auth.token);

  const [data, setData] = useState<SpeciesItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSpeciesData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/vector-api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            query: `
              query GetRecordedSpecies($id: String!) {
                recordedSpeciesById(id: $id) {
                  id
                  species
                  display_name
                  category
                  color
                }
              }
            `,
            variables: { id: String(id) },
          }),
        });

        if (!res.ok) throw new Error('Server returned an error status.');
        const json = await res.json();
        const speciesRecord = json.data?.recordedSpeciesById;

        if (!speciesRecord) {
          setData({
            id: String(id),
            species: '',
            displayName: '',
            category: 'Secondary',
            color: '#038543',
          });
        } else {
          const fetchedCategory =
            speciesRecord.category === 'Primary' ? 'Primary' : 'Secondary';

          const initialDisplayName = speciesRecord.display_name?.trim()
            ? speciesRecord.display_name
            : speciesRecord.species
            ? speciesRecord.species.charAt(0).toUpperCase() +
              speciesRecord.species.slice(1)
            : '';

          setData({
            id: speciesRecord.id,
            species: speciesRecord.species || '',
            displayName: initialDisplayName,
            category: fetchedCategory,
            color:
              fetchedCategory === 'Secondary'
                ? '#038543'
                : speciesRecord.color || '#038543',
          });
        }
      } catch (err) {
        console.error(err);
        toast.error(
          t('editPage.alerts.loadError') ||
            'Failed to load active species profile record from database'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSpeciesData();
  }, [id, token, t]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (!data) return;

    if (name === 'category') {
      setData({
        ...data,
        category: value,
        color: value === 'Secondary' ? '#038543' : data.color,
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      setSaving(true);

      const response = await fetch('/vector-api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: `
            mutation UpdateRecordedSpecies($input: UpdateRecordedSpeciesInput!) {
              updateRecordedSpecies(input: $input) {
                id
                display_name
                category
                color
              }
            }
          `,
          variables: {
            input: {
              id: String(data.id),
              displayName: data.displayName,
              category: data.category,
              color: data.color,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Database transaction failed: ${errorText}`);
      }

      const json = await response.json();
      if (json.errors) {
        throw new Error(json.errors[0].message || 'GraphQL processing error.');
      }

      await Swal.fire({
        icon: 'success',
        title: t('editPage.alerts.successTitle') || 'Species Record Saved',
        text:
          t('editPage.alerts.successText') ||
          'Successfully updated parameters.',
      });

      router.push('/speciesCatalogue');
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: t('editPage.alerts.errorTitle') || 'Submission Error',
        text: err.message || 'Failed to execute database transmission.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => router.push('/speciesCatalogue')}
      >
        {t('editPage.backBtn') || '← Back to Catalogue'}
      </Button>

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          {t('editPage.header') || 'Edit Species Entry'}
        </Typography>

        {data && (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label={t('editPage.coreIdLabel') || 'System Core ID Record Link'}
              value={data.id}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label={
                t('editPage.scientificNameLabel') ||
                'Scientific Name (Database Reference)'
              }
              value={data.species}
              fullWidth
              margin="normal"
              disabled
              InputProps={{
                style: {
                  fontStyle: 'italic',
                  fontWeight: 600,
                  backgroundColor: '#f9f9f9',
                },
              }}
              helperText={
                t('editPage.scientificNameHelper') ||
                'Standard classification label defined during initial data ingestion.'
              }
            />

            <TextField
              label={t('grid.displayName') || 'Display Name'}
              name="displayName"
              value={data.displayName}
              fullWidth
              margin="normal"
              onChange={handleChange}
              placeholder={
                t('editPage.displayNamePlaceholder') ||
                'Enter a friendly layout name'
              }
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="category-select-label">
                {t('grid.category') || 'Category'}
              </InputLabel>
              <Select
                labelId="category-select-label"
                name="category"
                value={data.category}
                label={t('grid.category') || 'Category'}
                onChange={handleChange}
              >
                <MenuItem value="Primary">
                  {t('filters.categories.Primary') || 'Primary'}
                </MenuItem>
                <MenuItem value="Secondary">
                  {t('filters.categories.Secondary') || 'Secondary'}
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={t('editPage.colorLabel') || 'Custom Map Dot Color'}
              name="color"
              type="color"
              value={data.color}
              fullWidth
              margin="normal"
              onChange={handleChange}
              disabled={data.category === 'Secondary'}
              helperText={
                data.category === 'Secondary'
                  ? t('editPage.colorHelperSecondary') ||
                    'Secondary category species are locked to green.'
                  : t('editPage.colorHelperPrimary') ||
                    'Adjust picker to modify layer color.'
              }
              InputProps={{
                style: {
                  height: '48px',
                  padding: '6px',
                  backgroundColor:
                    data.category === 'Secondary' ? '#f0f0f0' : 'inherit',
                },
              }}
            />

            <Box
              sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => router.push('/speciesCatalogue')}
                disabled={saving}
              >
                {t('editPage.cancel') || 'Cancel'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('editPage.updateBtn') || 'Update Parameters'
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SpeciesForm;
