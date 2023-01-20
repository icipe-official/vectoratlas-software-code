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

export default function AboutBanner() {
  return (
    <Box data-testid='about' sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button size="small" variant="contained" sx={{ width: '100%' }}>
        <Typography variant="body2" sx={{ fontSize: '2vw' }}>
          Join mailing list
        </Typography>
      </Button>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        sx={{ width: '100%' }}
      >
        <Typography variant="body2" sx={{ fontSize: '2vw' }}>
          Find out more
        </Typography>
      </Button>
    </Box>
  );
}
