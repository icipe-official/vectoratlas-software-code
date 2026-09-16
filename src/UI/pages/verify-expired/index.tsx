import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const VerifyExpiredPage = (): JSX.Element => {
  const t = useTranslations('EmailSubscription');

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: 'warning.main' }}
        >
          {t('verifyExpiredTitle') || 'Link Expired'}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {t('verifyExpiredBody') ||
            'This verification link has expired. Please subscribe again to receive a new one.'}
        </Typography>
        <Link href="/subscribe" passHref>
          <Button variant="contained">
            {t('subscribeAgainBtn') || 'Subscribe Again'}
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default VerifyExpiredPage;
