import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

type VerifyStatus = 'success' | 'already_verified' | 'expired' | 'invalid';

interface Props {
  status: VerifyStatus;
}

const VerifySuccessPage = ({ status }: Props): JSX.Element => {
  const t = useTranslations('EmailSubscription');

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
  const messages = await getMessages(context);
  const token = context.query.token;

  let status: VerifyStatus = 'invalid';

  if (typeof token === 'string' && token.length > 0) {
    try {
      const res = await fetch(
        `${process.env.API_BASE_URL}/api/verify?token=${encodeURIComponent(
          token
        )}`
      );

      if (res.ok) {
        status = 'success';
      } else {
        const body = await res.json().catch(() => ({}));
        const message: string = body?.message || '';
        if (message.toLowerCase().includes('expired')) {
          status = 'expired';
        } else if (message.toLowerCase().includes('already')) {
          status = 'already_verified';
        } else {
          status = 'invalid';
        }
      }
    } catch {
      status = 'invalid';
    }
  }

  return {
    props: {
      ...messages.props,
      status,
    },
  };
}

export default VerifySuccessPage;
