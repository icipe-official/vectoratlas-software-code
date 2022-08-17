import { Paper, Typography, Divider, Box } from '@mui/material';

export default function AboutContact() {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'justify-between',
        alignItems: 'left',
      }}
    >
      <Typography variant="h5" color="primary" mt="20px" pl="15px" mb="5px">
        Contact
      </Typography>
      <Divider orientation="horizontal" flexItem />
      <Box p="15px">
        <Typography variant="body1" textAlign="justify">
          Contact Information. Emails addresses, building address etc
        </Typography>
      </Box>
    </Paper>
  );
}