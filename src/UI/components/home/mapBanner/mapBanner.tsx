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

import AboutMapOverlay from './aboutMapOverlay';
import {
  overlayDivAbsoluteMobile,
  overlayDivAbsoluteBrowser,
  overlayContainerMobile,
  overlayContainerBrowser,
  typoDescMobile, // Add this
  exploreDataButtonMobile, // Add this
  exploreDataButtonBrowser,
} from './resizeStyling';
import { useTranslations } from 'next-intl';

export default function MapBanner() {
  const t = useTranslations('MapBanner');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = () => {
    router.push('/map');
  };

  const handleJoin = (e: any) => {
    router.push(
      'mailto:vectoratlas@icipe.org?subject=Joining the Vector Atlas mailing list'
    );
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleMore = (e: any) => {
    router.push('/about');
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const paper = {
    display: 'flex',
    position: 'relative',
    background: 'primary.main',
    height: 'fit-content',
    boxShadow: 5,
    margin: 0,
    marginBottom: 2,
    '&:hover': {
      cursor: 'pointer',
      boxShadow: 10,
    },
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Paper
        data-testid="mapBanner"
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row', // Stack vertically on mobile
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        {/* Background Image */}
        <Box sx={{ width: '100%', position: 'relative' }}>
          <img
            src="home/landing.jpg"
            style={{ width: '100%', display: 'block', borderRadius: '5px' }}
            alt="Vector Atlas Landscape"
          />

          {/* Text Overlay - Absolute on Desktop, Relative/Below on Mobile */}
          <Box
            style={
              isMobile ? overlayDivAbsoluteMobile : overlayDivAbsoluteBrowser
            }
            sx={{
              backgroundColor: isMobile ? 'transparent' : 'none',
            }}
          >
            <div
              style={
                isMobile ? overlayContainerMobile : overlayContainerBrowser
              }
            >
              {!isMobile && (
                <img
                  src="/vector-atlas-logo.svg"
                  style={{ width: '100%', maxWidth: '300px' }}
                  alt="Logo"
                />
              )}

              <Typography
                style={
                  isMobile
                    ? typoDescMobile
                    : {
                        width: '300px',
                        textAlign: 'right',
                        background: 'rgba(157, 229, 253, 0.7)',
                        padding: '10px',
                      }
                }
              >
                {t('intro')}
              </Typography>

              <Button
                variant="contained"
                style={
                  isMobile ? exploreDataButtonMobile : exploreDataButtonBrowser
                }
              >
                <Typography variant="button">{t('explore')}</Typography>
                <ArrowForwardIcon sx={{ ml: 1 }} />
              </Button>
            </div>
          </Box>
        </Box>
      </Paper>

      {/* Action Buttons for Mobile - Place them below the banner for clarity */}
      {isMobile && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleJoin}
            sx={{ borderRadius: '4px' }}
          >
            {t('joinMailingList')}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="warning" // Matching your yellow color in screenshots
            onClick={handleMore}
            sx={{ borderRadius: '4px' }}
          >
            {t('more')}
          </Button>
        </Box>
      )}
    </Box>
  );
}
