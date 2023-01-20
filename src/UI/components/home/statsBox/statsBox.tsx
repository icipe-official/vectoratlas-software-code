import {
  Paper,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StatsToggle from './statsToggle';
import { isMoreToggle } from '../../../state/home/homeSlice';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import {
  statsIconMobile,
  statsIconBrowser,
  statsMobile,
  statsBrowser,
} from './resizeStyling';

export default function StatsBox() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const more = useAppSelector((s) => s.home.isMore);
  const dispatch = useAppDispatch();

  const handleMore = () => {
    dispatch(isMoreToggle());
  };

  const sx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const paper = {
    marginTop: '1vw',
    paddingBottom: 1,
    '&:hover': {
      boxShadow: 10,
    },
  };

  return (
    <Paper sx={paper}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          p: 1,
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: 'fit-content',
          }}
        >
          <AnalyticsIcon sx={isMobile ? statsIconMobile : statsIconBrowser} />
          <Typography color="primary" variant="h4" sx={{ fontSize: '5vw' }}>
            Statistics
          </Typography>
        </div>
      </Box>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
          <picture>
            <img
              src="download.svg"
              style={isMobile ? statsMobile : statsBrowser}
              alt="placeholder"
            />
          </picture>
          <Typography color="black" variant="h5" sx={{ fontSize: '3.5vw' }}>
            27
          </Typography>
          <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
            Downloads
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
          <Typography color="black" variant="h5" sx={{ fontSize: '3.5vw' }}>
            6821
          </Typography>
          <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
            Data Points
          </Typography>
        </Grid>
        {isMobile ? (
          <>
            {more ? (
              <StatsToggle />
            ) : (
              <Button
                onClick={handleMore}
                sx={{ marginBottom: 0, paddingBottom: 0 }}
              >
                <Typography sx={{ fontSize: '3.5vw' }}>Show more...</Typography>
              </Button>
            )}
          </>
        ) : (
          <StatsToggle />
        )}
      </Grid>
    </Paper>
  );
}