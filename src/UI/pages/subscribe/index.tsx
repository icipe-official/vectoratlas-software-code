import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const SubscribePage = (): JSX.Element => {
  const t = useTranslations('EmailSubscription');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    notifications_enabled: true,
  });

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const canSubmit =
    form.first_name.trim().length > 0 &&
    form.last_name.trim().length > 0 &&
    isValidEmail &&
    status !== 'loading';

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/vector-api/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          email: form.email.trim().toLowerCase(),
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.message || 'Failed to subscribe. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {t('title') || 'Subscribe for Updates'}
        </Typography>

        {status === 'success' ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t('successMessage') ||
              "Almost done! We've sent a verification link to your email — please check your inbox to confirm."}
          </Alert>
        ) : (
          <>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {t('description') ||
                'Get notified about news and new datasets on VectorAtlas.'}
            </Typography>

            <TextField
              fullWidth
              label="First Name"
              value={form.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              margin="normal"
              required
              error={status === 'error' && !form.first_name.trim()}
            />

            <TextField
              fullWidth
              label="Last Name"
              value={form.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              margin="normal"
              required
              error={status === 'error' && !form.last_name.trim()}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              margin="normal"
              required
              error={!!form.email && !isValidEmail}
              helperText={
                !!form.email && !isValidEmail
                  ? 'Please enter a valid email'
                  : ''
              }
            />

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.notifications_enabled}
                    onChange={(e) =>
                      handleChange('notifications_enabled', e.target.checked)
                    }
                  />
                }
                label={
                  t('notificationsLabel') ||
                  'Subscribe to news and dataset updates'
                }
              />
            </Box>

            {status === 'error' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {status === 'loading' ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('subscribeBtn') || 'Subscribe'
              )}
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default SubscribePage;
