import { Box, Grid } from '@mui/material';
import { team } from './data/team';
import AboutTeamPanel from './aboutTeamPanel';

export default function AboutTeam() {
  const teamMembers = team.teamList;
  return (
    <Box p='35px' sx={{ width: 1 }}>
      <Grid data-testid='teamListContainer' container spacing={8} alignItems='center' justifyContent='center'>
        {teamMembers.map((teamMember) => (
          <AboutTeamPanel key={teamMember.id} {...teamMember} />
        ))}
      </Grid>
    </Box>
  );
}
