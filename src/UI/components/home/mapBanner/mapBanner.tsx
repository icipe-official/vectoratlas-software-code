import {
  Paper,
  Typography,
  Button,
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
} from './resizeStyling';

export default function MapBanner() {
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
    <Paper data-testid="mapBanner" sx={paper} onClick={handleClick}>
      <picture
        style={{ width: '100%', height: 'fit-content', marginBottom: -15 }}
      >
        <img
          src={isMobile ? 'home/home-map-mobile.png' : 'home/home-map.png'}
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
          {!isMobile ? (
            <picture>
              <img
                src="/vector-atlas-logo.svg"
                style={{ width: '100%' }}
                alt="Vector Atlas logo"
              />
            </picture>
          ) : null}
          <Typography
            variant="h6"
            style={{
              width: '300px',
              textAlign: isMobile ? 'left' : 'right',
              background: 'rgba(157, 229, 253, 0.7)',
            }}
          >
            Analyses-ready data and spatial models tailored for malaria vector
            control
          </Typography>
          <Button
            id="explore-data-button"
            className="exploreButton umami--click--explore-data-button"
            variant="contained"
            sx={{ bgcolor: 'black', marginRight: '0px', marginLeft: '0px' }}
          >
            <Typography>Explore the Data</Typography>
            <ArrowForwardIcon
              sx={{
                marginLeft: '10px',
              }}
            />
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
          <div
            onClick={(e) => {
              handleJoin(e);
            }}
          >
            <AboutMapOverlay
              buttonColor="primary"
              buttonText="Join mailing list"
            />
          </div>
          <div
            onClick={(e) => {
              handleMore(e);
            }}
          >
            <AboutMapOverlay
              buttonColor="secondary"
              buttonText="Find out more"
            />
          </div>
        </div>
      )}
    </Paper>
  );
}
