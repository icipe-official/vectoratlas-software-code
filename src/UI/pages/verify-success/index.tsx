import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const VerifySuccessPage = (): JSX.Element => {
  const t = useTranslations('EmailSubscription');

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: 'success.main' }}
        >
          {t('verifySuccessTitle') || 'Email Verified'}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {t('verifySuccessBody') ||
            "You're all set — you'll now receive the updates you signed up for."}
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
