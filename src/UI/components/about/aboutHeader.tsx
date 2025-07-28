'use client';

import { useTranslations } from 'next-intl';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { keyframes } from '@emotion/react';

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function AboutHeader() {
  const t = useTranslations('AboutPage');

  return (
    <Box
      sx={{
        px: 2,
        py: 4,
        maxWidth: 800,
        mx: 'auto',
        color: 'text.primary',
        fontFamily: 'Roboto, sans-serif',
        animation: `${fadeInUp} 0.8s ease both`,
      }}
    >
      <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
        {t('header.paragraph1')} {t('header.paragraph2')}{' '}
        {t('header.paragraph3')} <strong>{t('header.paragraph4A')}:</strong>{' '}
        <MuiLink
          href="https://forms.gle/yQeZezGfhdTZXUm4A"
          target="_blank"
          underline="hover"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            '&:hover': { color: 'primary.dark' },
          }}
        >
          {t('header.youtubeLinkText')}
        </MuiLink>
        . <strong>{t('header.paragraph4B')}:</strong>{' '}
        <MuiLink
          href="mailto:vectoratlas@icipe.org"
          underline="hover"
          sx={{
            color: 'secondary.main',
            fontWeight: 600,
            '&:hover': { color: 'secondary.dark' },
          }}
        >
          vectoratlas@icipe.org
        </MuiLink>
        .
      </Typography>
    </Box>
  );
}
