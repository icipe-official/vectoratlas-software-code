import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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

  const handleJoin = (e: any) => {
    router.push('mailto:vectoratlas@icipe.org?subject=Joining the Vector Atlas mailing list')
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleMore = (e) => {
    router.push('/about');
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const paper = {
    display: 'flex',
    position: 'relative',
    background: 'primary.main',
    height:'fit-content',
    boxShadow: 5,
    margin: 0,
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
          <div onClick={(e) => {handleJoin(e)}}>
            <AboutMapOverlay
              buttonColor="primary"
              buttonText="Join mailing list"
            />
          </div>
          <div onClick={(e) => {handleMore(e)}}>
            <AboutMapOverlay buttonColor="secondary" buttonText="Find out more" />
          </div>
        </div>
      )}
    </Paper>
  );
}
