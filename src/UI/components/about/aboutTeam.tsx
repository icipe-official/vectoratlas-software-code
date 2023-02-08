import { Box, Grid, Avatar, Typography, Button } from '@mui/material';
import data from './data/team.json';
import AboutTeamPanel from './aboutTeamPanel';
import { useState } from 'react';
import { isUndefined } from 'lodash';
import { useMediaQuery, useTheme } from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

export default function AboutTeam() {
  const teamMembers = data.teamList;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedTeamMember, setSelectedTeamMember] = useState<any>(undefined);

  return isMobile ? (
    <Box sx={{ width: 1 }}>
      <Grid
        
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
  ) : (
    <Box sx={{ width: '100%' }}>
      <Grid 
        data-testid="teamListContainer"
       container>
        <Grid item xs={12} md={selectedTeamMember ? 9 : 12}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {teamMembers.map((teamMember) => (
              <div
                key={teamMember.id}
                style={{
                  padding: '10px',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedTeamMember(teamMember)}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    sx={{
                      height: 100,
                      width: 100,
                      border:
                        teamMember === selectedTeamMember
                          ? '5px solid green'
                          : '',
                    }}
                    alt={teamMember.name}
                    src={teamMember.imageURL}
                  />
                </div>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                >
                  {teamMember.name}
                </Box>
                <Box sx={{ fontWeight: 'Medium', textAlign: 'center' }}>
                  {teamMember.location}
                </Box>
                <Box
                  sx={{
                    fontSize: isMobile ? '9px' : '12px',
                    textAlign: 'center',
                  }}
                >
                  {teamMember.position}
                </Box>
              </div>
            ))}
          </div>
        </Grid>
        {selectedTeamMember && (
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                border: 3,
                color: 'primary.main',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <Box
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  fontSize: 20,
                  justifyContent: 'space-between',
                }}
                data-testid="teamListbox"
              >
                {selectedTeamMember.name}
                <Button
                  onClick={() => setSelectedTeamMember(!selectedTeamMember)}
                  size="small"
                  sx={{
                    float: 'right',
                    margin: 0,
                    padding: 0,

                    minHeight: 0,
                    minWidth: 0,
                  }}
                >
                  {<HighlightOffOutlinedIcon sx={{ color: 'gray' }} />}
                </Button>
              </Box>
              <Box
                sx={{ paddingTop: 3, minHeight: 130 }}
                data-testid="teamMemberBox"
              >
                <Typography variant="body1">
                  {selectedTeamMember['description']}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
