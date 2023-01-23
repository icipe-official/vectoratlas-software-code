import {
  Paper,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import Link from 'next/link';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import router from 'next/router';

export default function AboutBanner() {
  return (
    <Box
      data-testid="about"
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Link
        passHref
        href="mailto:vectoratlas@icipe.org?subject=Joining the Vector Atlas mailing list"
      >
        <Button size="small" variant="contained" sx={{ width: '100%' }}>
          <Typography variant="body2" sx={{ fontSize: '2vw' }}>
            Join mailing list
          </Typography>
        </Button>
      </Link>
      <Link
        passHref
        href="/about"
      >
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
      </Link>
    </Box>
  );
}
