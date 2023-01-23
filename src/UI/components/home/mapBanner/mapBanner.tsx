import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import router from 'next/router';

import AboutMapOverlay from './aboutMapOverlay';
import {
  overlayDivAbsoluteMobile,
  overlayDivAbsoluteBrowser,
  overlayContainerMobile,
  overlayContainerBrowser,
  vectorAtlasLogoMobile,
  vectorAtlasLogoBrowser,
  divTypoContainerMobile,
  divTypoContainerBrowser,
  typoDescMobile,
  typoDescBrowser,
  exploreDataButtonMobile,
  exploreDataButtonBrowser,
} from './resizeStyling';

export default function MapBanner() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => {
    router.push('/map');
  };

  const handleMailingList = () => {
    router.push('/map');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const paper = {
    display: 'flex',
    position: 'relative',
    background: 'primary.main',
    boxShadow: 5,
    marginBottom: 2,
    '&:hover': {
      cursor: 'pointer',
      boxShadow: 10,
    },
  };

  return (
    <Paper data-testid="mapBanner" sx={paper} onClick={handleClick}>
      <picture
        style={{ width: '100%', height: 'fit-content', marginBottom: -15 }}
      >
        <img
          src={isMobile ? 'home/MapSmallMob.png' : 'home/MapSmall.png'}
          style={{ width: '100%', borderRadius: '5px' }}
          alt="placeholder"
        />
      </picture>
      <div
        style={isMobile ? overlayDivAbsoluteMobile : overlayDivAbsoluteBrowser}
      >
        <div
          style={isMobile ? overlayContainerMobile : overlayContainerBrowser}
        >
          <picture
            style={isMobile ? vectorAtlasLogoMobile : vectorAtlasLogoBrowser}
          >
            <img
              src="/vector-atlas-logo.svg"
              style={{ width: '100%' }}
              alt="Vector Atlas logo"
            />
          </picture>
          <div
            style={isMobile ? divTypoContainerMobile : divTypoContainerBrowser}
          >
            <Typography
              variant="body1"
              sx={isMobile ? typoDescMobile : typoDescBrowser}
            >
              Analyses-ready data and spatial models tailored for malaria vector
              control
            </Typography>
          </div>
          <Button
            variant="contained"
            sx={isMobile ? exploreDataButtonMobile : exploreDataButtonBrowser}
          >
            <Typography
              noWrap
              variant="body1"
              sx={
                isMobile
                  ? { fontSize: '2vw' }
                  : { marginLeft: '10px', fontSize: '1.0vw' }
              }
            >
              Explore the Data
            </Typography>
            {isMobile ? (
              <></>
            ) : (
              <ArrowForwardIcon
                sx={{
                  marginLeft: '10px',
                  marginRight: '10px',
                  fontSize: '2vw',
                }}
              />
            )}
          </Button>
        </div>
      </div>
      {isMobile ? (
        <></>
      ) : (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            padding: 15,
            width: '20vw',
          }}
        >
          <AboutMapOverlay
            buttonColor="primary"
            buttonText="Join mailing list"
          />
          <AboutMapOverlay buttonColor="secondary" buttonText="Find out more" />
        </div>
      )}
    </Paper>
  );
}
