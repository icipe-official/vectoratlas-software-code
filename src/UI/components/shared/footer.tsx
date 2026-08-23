import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  Grid,
} from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '../../state/hooks';

function Footer() {
  const t = useTranslations('Footer');
  const version_ui = useAppSelector((state) => state.config.version_ui);
  const version_api = useAppSelector((state) => state.config.version_api);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Vector Atlas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('description') ||
                'Mapping the future of vector-borne disease research.'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: 'block' }}
            >
              UI: {version_ui} | API: {version_api}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              {t('contactTitle') || 'Contact Us'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <MuiLink href="mailto:vectoratlas@icipe.org" underline="hover">
                vectoratlas@icipe.org
              </MuiLink>
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              {t('resourcesTitle') || 'Resources'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link href="/docs" passHref legacyBehavior>
                <MuiLink underline="hover">
                  {t('docs') || 'Documentation'}
                </MuiLink>
              </Link>
              <Link href="/datasets" passHref legacyBehavior>
                <MuiLink underline="hover">
                  {t('datasets') || 'Datasets'}
                </MuiLink>
              </Link>
              <Link href="/subscribe" passHref legacyBehavior>
                <MuiLink
                  underline="hover"
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  {t('subscribe') || 'Subscribe to Updates'}
                </MuiLink>
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 4,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Vector Atlas. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
