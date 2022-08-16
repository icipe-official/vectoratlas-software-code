import { Paper, Typography, Divider, Box, Button, Grid } from '@mui/material';


export default function AboutBanner() {
  return (
    <Paper sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Typography variant="h5" color='primary' m='20px'>
        Some main tagline with a brief mission statement
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Box>
        <Typography variant="body1" m='20px' mb="0px">
          Vector Atlas is a Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Typography>
        <Grid container justifyContent="flex-end">
          <Button variant="contained">Join Mailing List</Button>
          <Button variant="outlined">Find out more</Button>
        </Grid>
      </Box>
    </Paper>
  );
}
