import {
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { showMoreToggle } from '../../../state/home/homeSlice';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';

export default function StatsToggle() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useAppDispatch();

  const handleMore = () => {
    dispatch(showMoreToggle());
  };

  const stats = useAppSelector((s) => s.home.stats);

  const statsBrowser = { width: 60, paddingTop: '5px' };
  const statsMobile = { width: 30, paddingTop: '15px' };

  const sx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
        <picture>
          <img
            src="stickman.svg"
            style={isMobile ? statsMobile : statsBrowser}
            alt="placeholder"
          />
        </picture>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
            Total of:
          </Typography>
        <Typography color="black" variant="h5" sx={{ fontSize: '3.5vw' }}>
          {stats.uniqueViews}
        </Typography>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          {stats.uniqueViews === 1 ? 'vistor' : 'visitors'}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
        <picture>
          <img
            src="datapoints.svg"
            style={isMobile ? statsMobile : statsBrowser}
            alt="placeholder"
          />
        </picture>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
            Filtered Data:
          </Typography>
        <Typography color="black" variant="h5" sx={{ fontSize: '3.5vw' }}></Typography>
        <Typography color="black" variant="h5" sx={{ fontSize: '3.5vw' }}>
          {stats.events}
        </Typography>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          {stats.events === 1 ? 'download' : 'downloads'}
        </Typography>
      </Grid>
      {isMobile ? (
        <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
          <Button
            data-testid="closeStats"
            onClick={handleMore}
            variant="contained"
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <CloseIcon />
            <Typography variant="h6" sx={{ fontSize: '3.5vw' }}>
              Close
            </Typography>
          </Button>
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
}
