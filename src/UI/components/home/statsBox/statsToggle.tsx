import {
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { isMoreToggle } from '../../../state/home/homeSlice';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';

export default function StatsToggle() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const more = useAppSelector((s) => s.home.isMore);
  const dispatch = useAppDispatch();

  const handleMore = () => {
    dispatch(isMoreToggle());
  };

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
            src="africa.svg"
            style={isMobile ? statsMobile : statsBrowser}
            alt="placeholder"
          />
        </picture>
        <Typography color="black" variant="h5" sx={{ fontSize: '3.5vw' }}>
          13
        </Typography>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          Countries
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
        <picture>
          <img
            src="testtube.svg"
            style={isMobile ? statsMobile : statsBrowser}
            alt="placeholder"
          />
        </picture>
        <Typography color="black" variant="h5" sx={{ fontSize: '3.5vw' }}>
          4
        </Typography>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          Citations
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
        <picture>
          <img
            src="mosquito.svg"
            style={isMobile ? statsMobile : statsBrowser}
            alt="placeholder"
          />
        </picture>
        <Typography color="black" variant="h5" sx={{ fontSize: '3.5vw' }}>
          25
        </Typography>
        <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
          Species
        </Typography>
      </Grid>
      {isMobile ? (
        <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
          <Button
            data-testid='closeStats'
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
