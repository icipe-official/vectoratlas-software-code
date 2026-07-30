import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { useAppSelector } from '../../state/hooks';
import { useCountryDb } from '../shared/useCountryDb';

interface CountryItem {
  id: string;
  name: string;
  alternativeNames: string;
}

export const CountryEdit: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const t = useTranslations('countryTable.editPage');

  const token = useAppSelector((state) => state.auth.token);
  const records = useCountryDb(true);

  const [data, setData] = useState<CountryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || records.length === 0) return;

    const countryRecord = records.find((c: any) => c.id === String(id));

    if (!countryRecord) {
      toast.error(t('alerts.notFound') || 'Country record not found.');
      setLoading(false);
    } else {
      setData({
        id: countryRecord.id,
        name: countryRecord.name || '',
        alternativeNames: Array.isArray(countryRecord.alternative_names)
          ? countryRecord.alternative_names.join(', ')
          : countryRecord.alternative_names || '',
      });
      setLoading(false);
    }
  }, [id, records, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    setData({ ...data, [e.target.name]: e.target.value });
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
            mutation UpdateCountry($input: UpdateCountryInput!) {
              updateCountry(input: $input) {
                id
                name
              }
            }
          `,
          variables: {
            input: {
              id: String(data.id),
              name: data.name,
            },
          },
        }),
      });

      if (!response.ok) throw new Error('Database transaction failed');

      const json = await response.json();
      if (json.errors) throw new Error(json.errors[0].message);

      await Swal.fire({
        icon: 'success',
        title: t('alerts.successTitle'),
        text: t('alerts.successText'),
      });

      window.location.href = '/countryCatalogue';
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: t('alerts.errorTitle'),
        text: err.message || t('alerts.errorText'),
      });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => router.push('/countryCatalogue')}
      >
        {t('backBtn')}
      </Button>

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          {t('header')}
        </Typography>

        {data && (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label={t('coreIdLabel')}
              value={data.id}
              fullWidth
              margin="normal"
              disabled
              InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
            />

            <TextField
              label={t('alternativeNamesLabel')}
              value={data.alternativeNames}
              fullWidth
              margin="normal"
              disabled
              helperText={t('alternativeNamesHelper')}
              InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
            />

            <TextField
              label={t('displayNameLabel')}
              name="name"
              value={data.name}
              fullWidth
              margin="normal"
              onChange={handleChange}
              placeholder={t('displayNamePlaceholder')}
              helperText={t('displayNameHelper')}
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
                onClick={() => router.push('/countryCatalogue')}
                disabled={saving}
              >
                {t('cancel')}
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
                  t('updateBtn')
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CountryEdit;
