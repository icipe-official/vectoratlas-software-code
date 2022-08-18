import {
  Paper,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import {dummyTeam} from './dummyState';
import AboutTeamPanel from './aboutTeamPanel';


export default function AboutTeam() {
  const teamList = dummyTeam.team;
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h5' color='primary' pt='25px' px='35px'>
        The Team
      </Typography>
      <Box p='35px' sx={{width:1}}>
        <Grid container sx={{ fontFamily:'sans-serif'}} spacing={8} alignItems='center' justifyContent="center">
          { teamList.map(teamMember => (
            <AboutTeamPanel key={teamMember.id} name={teamMember.name} location={teamMember.location} position={teamMember.position} imageURL={teamMember.imageURL} />
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}

