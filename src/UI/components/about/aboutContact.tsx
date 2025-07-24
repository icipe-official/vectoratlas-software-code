import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Fade,
  Grow,
} from '@mui/material';
import { Email, Group } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
}));

const AnimatedBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '0%',
    height: '2px',
    background: 'linear-gradient(90deg, #4caf50, #388e3c)',
    transition: 'width 0.6s ease-in-out',
  },
  '&:hover::after': {
    width: '100%',
  },
}));

const StyledEmailLink = styled('a')(({ theme }) => ({
  color: '#4caf50',
  textDecoration: 'none',
  marginLeft: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  borderRadius: 6,
  background: 'rgba(25, 118, 210, 0.08)',
  transition: 'all 0.3s ease-in-out',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    background: 'rgba(25, 118, 210, 0.15)',
    transform: 'scale(1.05)',
    color: 'rgba(191, 231, 15, 1)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: 'rgba(25, 118, 210, 0.1)',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'rgba(25, 118, 210, 0.15)',
    transform: 'rotate(360deg)',
  },
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const SubtitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// Component
export default function AboutContact() {
  const t = useTranslations('AboutPage');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        width: '100%',
        padding: { xs: 2, sm: 3, md: 5 },
        background: 'white',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <Fade in={mounted} timeout={800}>
            <Grow in={mounted} timeout={1000}>
              <StyledCard>
                <StyledCardContent>
                  <AnimatedBox>
                    <IconWrapper>
                      <Group sx={{ color: '#FDD835', fontSize: 24 }} />
                    </IconWrapper>

                    <TitleTypography variant="h4">
                      Vector Atlas {t('contact.projectTeam')}
                    </TitleTypography>

                    <SubtitleTypography>
                      {t('contact.email')}:
                      <Link href="mailto:vectoratlas@icipe.org" passHref legacyBehavior>
                        <StyledEmailLink>
                          <Email sx={{ fontSize: 18 }} />
                          vectoratlas@icipe.org
                        </StyledEmailLink>
                      </Link>
                    </SubtitleTypography>

                    <Box
                      sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
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
                  </AnimatedBox>
                </StyledCardContent>
              </StyledCard>
            </Grow>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}
