import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const UnsubscribedSuccessPage = (): JSX.Element => {
  const t = useTranslations('EmailSubscription');

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: 'text.secondary' }}
        >
          {t('unsubscribedTitle') || 'Unsubscribed'}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {t('unsubscribedBody') ||
            "You've been removed from our mailing list. You won't receive any further updates."}
        </Typography>
        <Link href="/" passHref>
          <Button variant="outlined">
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

export default UnsubscribedSuccessPage;
