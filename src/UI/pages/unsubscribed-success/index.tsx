import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { apiUrl } from '../../api/api';

type UnsubscribeStatus = 'loading' | 'success' | 'invalid';

const UnsubscribePage = (): JSX.Element => {
  const t = useTranslations('EmailSubscription');
  const router = useRouter();
  const [status, setStatus] = useState<UnsubscribeStatus>('loading');
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!router.isReady || hasAttempted.current) return;

    const { id, token } = router.query;

    if (typeof id === 'string' && typeof token === 'string' && id && token) {
      hasAttempted.current = true;

      const processUnsubscribe = async () => {
        try {
          const res = await fetch(`${apiUrl}unsubscribe`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id.trim(), token: token.trim() }),
          });

          if (res.ok || res.status === 204) {
            setStatus('success');
          } else {
            setStatus('invalid');
          }
        } catch (err) {
          console.error('Unsubscribe request failed:', err);
          setStatus('invalid');
        }
      };

      processUnsubscribe();
    } else if (router.isReady) {
      setStatus('invalid');
    }
  }, [router.isReady, router.query]);

  const content = {
    loading: {
      title: 'Processing...',
      body: 'Please wait while we process your request.',
      color: 'text.primary',
    },
    success: {
      title: t('unsubscribeSuccessTitle') || 'Unsubscribed',
      body:
        t('unsubscribeSuccessBody') ||
        "You've been unsubscribed and won't receive further updates.",
      color: 'success.main',
    },
    invalid: {
      title: t('unsubscribeInvalidTitle') || 'Invalid Link',
      body:
        t('unsubscribeInvalidBody') ||
        'This unsubscribe link is invalid or has already been used.',
      color: 'error.main',
    },
  }[status];

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: content.color }}
        >
          {content.title}
        </Typography>

        {status === 'loading' ? (
          <CircularProgress sx={{ my: 3 }} />
        ) : (
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {content.body}
          </Typography>
        )}

        {status !== 'loading' && (
          <Link href="/" passHref>
            <Button variant="contained">
              {t('backHomeBtn') || 'Back to VectorAtlas'}
            </Button>
          </Link>
        )}
      </Box>
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default UnsubscribePage;
