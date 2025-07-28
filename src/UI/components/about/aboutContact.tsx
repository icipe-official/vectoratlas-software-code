import { Typography, Box, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Email, Group } from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function AboutContact() {
  const t = useTranslations('AboutPage');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box sx={{ width: '100%', fontFamily: 'sans-serif' }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'rgba(76, 175, 80, 0.5)',
              borderRadius: 4,
              padding: 3,
              boxShadow: 3,
              transition: 'all 0.3s ease-in-out',
              width: '100%',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-3px)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(25, 118, 210, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'rgba(25, 118, 210, 0.15)',
                    transform: 'rotate(360deg)',
                  },
                }}
              >
                <Group sx={{ color: '#FDD835', fontSize: 24 }} />
              </Box>

              <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                Vector Atlas {t('contact.projectTeam')}
              </Typography>
            </Box>

            <Typography sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
              {t('contact.email')}:
              <Link href="mailto:vectoratlas@icipe.org" passHref legacyBehavior>
                <a
                  style={{
                    color: '#4caf50',
                    marginLeft: '8px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(25, 118, 210, 0.08)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(25, 118, 210, 0.15)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.color = 'rgba(191, 231, 15, 1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(25, 118, 210, 0.08)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.color = '#4caf50';
                  }}
                >
                  <Email sx={{ fontSize: 18 }} />
                  vectoratlas@icipe.org
                </a>
              </Link>
            </Typography>

            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: '1px solid rgba(76, 175, 80, 0.5)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontStyle: 'italic',
                }}
              >
                Get in touch with our dedicated team for any inquiries or
                collaboration opportunities.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
