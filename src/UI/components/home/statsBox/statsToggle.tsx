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

  const sx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          across...
        </Typography>
        <Typography color="black" variant="h4" sx={{ fontSize: '3.5vw' }}>
          {stats.countries}
        </Typography>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          {stats.countries === 1 ? 'country' : 'countries'}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          accessed via...
        </Typography>
        <Typography color="black" variant="h4" sx={{ fontSize: '3.5vw' }}>
          {stats.eventDownload}
        </Typography>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          downloads
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
