import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

type UnsubscribeStatus = 'success' | 'invalid';

interface Props {
  status: UnsubscribeStatus;
}

const UnsubscribePage = ({ status }: Props): JSX.Element => {
  const t = useTranslations('EmailSubscription');

  const content = {
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
  const { id, token } = context.query;

  let status: UnsubscribeStatus = 'invalid';

  if (typeof id === 'string' && typeof token === 'string' && id && token) {
    try {
      const res = await fetch(`${process.env.API_BASE_URL}/api/unsubscribe`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token }),
      });

      status = res.ok ? 'success' : 'invalid';
    } catch (err) {
      console.error('unsubscribe fetch failed:', err);
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

export default UnsubscribePage;
