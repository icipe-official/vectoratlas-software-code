import { Box, Grid, Avatar, Typography, Button } from '@mui/material';
import AboutTeamPanel from './aboutTeamPanel';
import { useEffect, useState } from 'react';
import { isUndefined } from 'lodash';
import { useMediaQuery, useTheme } from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import store, { AppState } from '../../state/store';

export default function AboutTeam() {
  const locale = (store.getState() as AppState).localization.locale || 'en';
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedTeamMember, setSelectedTeamMember] = useState<any>(undefined);

  useEffect(() => {
    const loadTeam = async () => {
      const team = (await import('./data/team.json')).default;
      setTeamMembers(team?.teamList);
    };
    loadTeam();
  }, [locale]);

  return isMobile ? (
    <Box sx={{ width: 1 }}>
      <Grid container spacing={5} alignItems="stretch" justifyContent="center">
        {teamMembers.map((teamMember) => (
          <AboutTeamPanel key={teamMember.id} {...teamMember} />
        ))}
      </Grid>
    </Box>
  ) : (
    <Box sx={{ width: '100%' }}>
      <Grid data-testid="teamListContainer" container>
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
                data-testid="openMember"
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    sx={{
                      height: 110,
                      width: 110,
                      border:
                        teamMember === selectedTeamMember
                          ? '3px solid #4caf50'
                          : '2px solid #ccc',
                      filter:
                        teamMember === selectedTeamMember
                          ? 'none'
                          : 'grayscale(30%)',
                      boxShadow:
                        teamMember === selectedTeamMember
                          ? '0 4px 12px rgba(76, 175, 80, 0.5)'
                          : '0 2px 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.08)',
                        filter: 'grayscale(0%)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                        borderColor: 'rgba(76, 175, 80, 0.5)',
                      },
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
                backgroundColor: 'white',
                boxShadow: 3,
              }}
              data-testid="teamListbox"
            >
              <Box
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  fontSize: 20,
                  justifyContent: 'space-between',
                }}
              >
                {selectedTeamMember.name}
                <Button
                  onClick={() => setSelectedTeamMember(undefined)}
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
                  {selectedTeamMember.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
