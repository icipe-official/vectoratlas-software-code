import { Box, Grid } from '@mui/material';
import data from './data/team.json';
import AboutTeamPanel from './aboutTeamPanel';

export default function AboutTeam() {
  const teamMembers = data.teamList;
  return (
    <Box sx={{ width: 1 }}>
      <Grid
        data-testid="teamListContainer"
        container
        spacing={5}
        alignItems="stretch"
        justifyContent="center"
      >
        {teamMembers.map((teamMember) => (
          <AboutTeamPanel key={teamMember.id} {...teamMember} />
        ))}
      </Grid>
    </Box>
  );
}
