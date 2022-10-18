import { Typography, Box, Grid } from '@mui/material';
import Link from 'next/link';

export default function AboutContact() {
  return (
    <Box pl={5} sx={{ width: 1 }}>
      <Grid
        container
        sx={{ fontFamily: 'sans-serif' }}
        spacing={8}
        alignItems="start"
      >
        <Grid container item md={6} sm={12}>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>
              Vector Atlas project team
            </Typography>
            <Typography sx={{ fontSize: '14px' }}>
              Email:{' '}
              <Link href="mailto:vectoratlas@icipe.org" passHref>
                <a style={{ color: 'blue' }}>vectoratlas@icipe.org</a>
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
