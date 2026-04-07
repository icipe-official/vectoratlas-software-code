import {
  Paper,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import router from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// ─── Keyframe injection (one-time, idempotent) ───────────────────────────────
const STYLE_ID = 'vector-atlas-banner-animations';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* Slide-in from right for desktop overlay */
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* Fade-up for mobile overlay */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .va-overlay-desktop {
      animation: slideInRight 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .va-overlay-mobile {
      animation: fadeUp 0.6s ease both;
    }
  `;
  document.head.appendChild(style);
}

export default function MapBanner() {
  const t = useTranslations('MapBanner');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = () => router.push('/map');

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    (e.nativeEvent as Event).stopImmediatePropagation();
    router.push(
      'mailto:vectoratlas@icipe.org?subject=Joining the Vector Atlas mailing list'
    );
  };

  const handleMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    (e.nativeEvent as Event).stopImmediatePropagation();
    router.push('/about');
  };

  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      <Paper
        data-testid="mapBanner"
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          position: 'relative',
          overflow: 'hidden',
          minHeight: isMobile ? '350px' : 'auto',
          cursor: 'pointer',
          borderRadius: '5px',
          transition: 'box-shadow 0.3s ease',
          '&:hover': { boxShadow: 10 },
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            position: 'relative',
            bgcolor: '#f0f0f0',
          }}
        >
          <img
            src="home/landing.jpg"
            style={{
              width: '100%',
              // Using 'contain' on mobile ensures the whole image is visible
              // Using 'cover' on desktop keeps the professional full-bleed look
              height: isMobile ? 'auto' : '100%',
              maxHeight: isMobile ? '350px' : 'none',
              objectFit: isMobile ? 'contain' : 'cover',
              display: 'block',
              // Pushes the image to the top of the container
              objectPosition: 'top center',
            }}
            alt="Vector Atlas Map"
          />

          {/* Text Overlay */}
          <Box
            className={isMobile ? 'va-overlay-mobile' : 'va-overlay-desktop'}
            sx={{
              position: isMobile ? 'relative' : 'absolute',
              right: isMobile ? 'unset' : 0,
              bottom: '0.5vw',
              padding: isMobile ? '10px' : '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-end',
            }}
          >
            {!isMobile && (
              <img
                src="/vector-atlas-logo.svg"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  marginBottom: '8px',
                }}
                alt="Logo"
              />
            )}

            {/* Main Text Card with Glassmorphism */}
            <Box
              sx={{
                width: isMobile ? '90%' : '320px',
                // 1. The "Glassy" effect: semi-transparent white + blur
                background: 'rgba(157, 229, 253, 0.95)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', // Support for Safari
                border: '1px solid rgba(255, 255, 255, 0.3)',

                padding: '16px',
                borderRadius: '12px',
                marginBottom: '12px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: isMobile ? 'none' : 'translateY(-5px)',
                  background: 'rgba(157, 229, 253, 0.95)',
                },
              }}
            >
              <Typography
                sx={{
                  textAlign: isMobile ? 'center' : 'right',
                  // 2. Adjust font size for mobile so it's readable but fits
                  fontSize: isMobile ? '0.85rem' : '0.95rem',
                  lineHeight: 1.5,
                  color: '#003d5c',
                  fontWeight: 600,
                  // 3. FIXED: Removed display: { xs: 'none' } so text shows on all screens
                  display: 'block',
                }}
              >
                {t('intro')}
              </Typography>
            </Box>

            {/* Explore Button */}
            <Button
              className="va-explore-btn"
              variant="contained"
              sx={{
                width: isMobile ? '70vw' : 'fit-content',
                minWidth: !isMobile ? '200px' : 'unset',
                px: !isMobile ? 4 : 2,
                backgroundColor: 'black',
                color: 'white',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#038543 !important',
                  transform: 'scale(0.95)',
                  boxShadow: '0 4px 20px rgba(3, 133, 67, 0.4)',
                },
                '& .MuiTypography-root': {
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            >
              <Typography variant="button">{t('explore')}</Typography>
              <ArrowForwardIcon
                sx={{
                  ml: 1,
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  transition: 'transform 0.3s ease',
                  '.va-explore-btn:hover &': {
                    transform: 'translateX(4px)',
                  },
                }}
              />
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Mobile-only Quick Actions */}
      {isMobile && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleJoin}
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              bgcolor: 'primary.main',
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            {t('joinMailingList')}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={handleMore}
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            {t('more')}
          </Button>
        </Box>
      )}
    </Box>
  );
}
