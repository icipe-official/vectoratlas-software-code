import { Typography, Box, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AboutContact() {
  const t = useTranslations('AboutPage');
  return (
    <Box pl={5} sx={{ width: 1 }}>
      <Grid
        container
        sx={{ fontFamily: 'sans-serif' }}
        spacing={8}
        alignItems="start"
      >
        <Grid container item md={6} sm={12}>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>
              Vector Atlas {t('contact.projectTeam')}
            </Typography>
            <Typography sx={{ fontSize: '14px' }}>
              {t('contact.email')}:
              <Link href="mailto:vectoratlas@icipe.org" passHref>
                <a style={{ color: 'blue' }}>vectoratlas@icipe.org</a>
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
