import { Paper, Typography, Divider, Box, Link } from '@mui/material';

export default function AboutTeam() {
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
        Team
      </Typography>
      <Divider orientation="horizontal" flexItem />
      <Box p="15px">
        <Typography variant="body1" textAlign="justify">
          Find out who we want in team.
        </Typography>
      </Box>
    </Paper>
  );
}
