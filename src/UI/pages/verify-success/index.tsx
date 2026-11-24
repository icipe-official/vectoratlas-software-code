import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

type VerifyStatus =
  | 'loading'
  | 'success'
  | 'already_verified'
  | 'expired'
  | 'invalid';

const VerifySuccessPage = (): JSX.Element => {
  const t = useTranslations('EmailSubscription');
  const router = useRouter();
  const [status, setStatus] = useState<VerifyStatus>('loading');

  useEffect(() => {
    if (!router.isReady) return;

    const token = router.query.token;
    if (typeof token !== 'string' || !token.trim()) {
      setStatus('invalid');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `/vector-api/verify?token=${encodeURIComponent(token.trim())}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          }
        );

        if (res.ok) {
          setStatus('success');
        } else {
          const body = await res.json().catch(() => ({}));
          const message: string = body?.message || '';
          if (message.toLowerCase().includes('expired')) {
            setStatus('expired');
          } else if (message.toLowerCase().includes('already')) {
            setStatus('already_verified');
          } else {
            setStatus('invalid');
          }
        }
      } catch (error) {
        console.error('Verification fetch failed:', error);
        setStatus('invalid');
      }
    };

    verifyEmail();
  }, [router.isReady, router.query.token]);

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const content = {
    success: {
      title: t('verifySuccessTitle') || 'Email Verified',
      body:
        t('verifySuccessBody') ||
        "You're all set — you'll now receive the updates you signed up for.",
      color: 'success.main',
    },
    already_verified: {
      title: t('verifyAlreadyTitle') || 'Already Verified',
      body:
        t('verifyAlreadyBody') ||
        'This email address has already been verified.',
      color: 'success.main',
    },
    expired: {
      title: t('verifyExpiredTitle') || 'Link Expired',
      body:
        t('verifyExpiredBody') ||
        'This verification link has expired. Please subscribe again to get a new one.',
      color: 'error.main',
    },
    invalid: {
      title: t('verifyInvalidTitle') || 'Invalid Link',
      body:
        t('verifyInvalidBody') ||
        'This verification link is invalid. Please check the link or subscribe again.',
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
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {content.body}
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained">
            {t('backHomeBtn') || 'Back to VectorAtlas'}
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default VerifySuccessPage;
