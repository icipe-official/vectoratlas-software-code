import { Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function AboutBanner() {
  return (
    <Box
      data-testid="about"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: 1,
      }}
    >
      <Link
        passHref
        href="mailto:vectoratlas@icipe.org?subject=Joining the Vector Atlas mailing list"
      >
        <Button size="small" variant="contained" sx={{ width: '100%', ml: 0 }}>
          <Typography variant="body1">Join mailing list</Typography>
        </Button>
      </Link>
      <Link passHref href="/about">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          sx={{ width: '100%', mr: 0 }}
        >
          <Typography variant="body1">Find out more</Typography>
        </Button>
      </Link>
    </Box>
  );
}
