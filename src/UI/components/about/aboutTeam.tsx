import {
  Paper,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import dummyState from './dummyState';
import AboutTeamPanel from './aboutTeamPanel';


export default function AboutTeam() {
  const dummyTeam = dummyState.dummyTeam;
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h5' color='primary' mt='20px' pl='15px' mb='5px'>
        The Team
      </Typography>
      <Box p='15px' sx={{width:1}}>
        <Grid p='15px' container sx={{ fontFamily:'sans-serif'}} spacing={8} alignItems='center' justifyContent="center">
          { dummyTeam.map(teamMember => (
            <AboutTeamPanel key={teamMember.id} name={teamMember.name} location={teamMember.location} position={teamMember.position} imageURL={teamMember.imageURL} />
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}

