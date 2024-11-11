'use client';

import { Typography, Box, Link as MuiLink } from '@mui/material';
import { useTranslations } from 'next-intl';
import { keyframes } from '@emotion/react';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function AboutHeader() {
  const t = useTranslations('AboutPage');

  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: { xs: 2, sm: 4 },
        py: 4,
        color: 'text.primary',
        fontFamily: 'Roboto, sans-serif',
        animation: `${fadeInUp} 0.8s ease both`,
      }}
    >
      {[1, 2, 3].map((index) => (
        <Typography
          key={index}
          variant="body1"
          sx={{
            textAlign: 'justify',
            lineHeight: 1.8,
            fontSize: '1.1rem',
            mb: 3,
          }}
        >
          {t(`header.paragraph${index}`)}
        </Typography>
      ))}

      <Typography
        variant="body1"
        sx={{
          textAlign: 'justify',
          lineHeight: 1.8,
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}
      >
        {t('header.paragraph4A')}:{' '}
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
        . {t('header.paragraph4B')}:{' '}
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
