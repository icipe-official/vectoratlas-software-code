import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

const SubscribePage = (): JSX.Element => {
  const t = useTranslations('EmailSubscription');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    notifications_enabled: true,
  });

  const [status, setStatus] = useState<
    | 'idle'
    | 'subscribing'
    | 'unsubscribing'
    | 'subscribe_success'
    | 'unsubscribe_success'
    | 'unsubscribe_direct'
    | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isProcessing = status === 'subscribing' || status === 'unsubscribing';

  const canSubmitSubscribe =
    form.first_name.trim().length > 0 &&
    form.last_name.trim().length > 0 &&
    isValidEmail &&
    !isProcessing;
  const canSubmitUnsubscribe = isValidEmail && !isProcessing;

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubscribeSubmit = async () => {
    if (!canSubmitSubscribe) return;
    setStatus('subscribing');
    setErrorMsg('');

    try {
      const res = await fetch('/vector-api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          email: form.email.trim().toLowerCase(),
        }),
      });

      if (res.ok) {
        setStatus('subscribe_success');
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

  const handleUnsubscribeRequest = async () => {
    if (!canSubmitUnsubscribe) return;
    setStatus('unsubscribing');
    setErrorMsg('');

    try {
      const res = await fetch('/vector-api/request-unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim().toLowerCase() }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        // Route success state based on backend action
        if (data.type === 'direct_disable') {
          setStatus('unsubscribe_direct');
        } else {
          setStatus('unsubscribe_success');
        }
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.message || 'Request failed. Please try again.');
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

        {status === 'subscribe_success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t('successMessage') ||
              "Almost done! We've sent a verification link to your email — please check your inbox to confirm."}
          </Alert>
        )}

        {status === 'unsubscribe_success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            We have sent you a secure unsubscription link. Please check your
            inbox to confirm.
          </Alert>
        )}

        {/* New Direct Success UI */}
        {status === 'unsubscribe_direct' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <p>
              You are not a subscriber. However your account notifications have
              been successfully disabled.{' '}
            </p>
            <p> Visit settings to re-enable.</p>
          </Alert>
        )}

        {status !== 'subscribe_success' &&
          status !== 'unsubscribe_success' &&
          status !== 'unsubscribe_direct' && (
            <>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {t('description') ||
                  'Get notified about news and new datasets on VectorAtlas.'}
              </Typography>

              <TextField
                fullWidth
                label="First Name"
                value={form.first_name}
                margin="normal"
                onChange={(e) => handleChange('first_name', e.target.value)}
                disabled={isProcessing}
              />

              <TextField
                fullWidth
                label="Last Name"
                value={form.last_name}
                margin="normal"
                onChange={(e) => handleChange('last_name', e.target.value)}
                disabled={isProcessing}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={form.email}
                margin="normal"
                required
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isProcessing}
                error={!!form.email && !isValidEmail}
                helperText={
                  !!form.email && !isValidEmail
                    ? 'Please enter a valid email'
                    : ''
                }
              />

              {status === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errorMsg}
                </Alert>
              )}

              {/* Subscribe Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                onClick={handleSubscribeSubmit}
                disabled={!canSubmitSubscribe}
                color="primary"
              >
                {status === 'subscribing' ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('subscribeBtn') || 'Subscribe'
                )}
              </Button>

              {/* Unsubscribe Button */}
              <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                onClick={handleUnsubscribeRequest}
                disabled={!canSubmitUnsubscribe}
                color="error"
              >
                {status === 'unsubscribing' ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Request Unsubscribe Link'
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
