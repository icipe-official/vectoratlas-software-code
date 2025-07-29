'use client';

import {
  Box,
  Grid,
  Avatar,
  Typography,
  Button,
  Modal,
  Fade,
  Backdrop,
} from '@mui/material';
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
      const team = (await import('./data/team-en.json')).default;
      setTeamMembers(team?.teamList);
    };
    loadTeam();
  }, [locale]);

  const handleClose = () => setSelectedTeamMember(undefined);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={5} alignItems="stretch" justifyContent="center">
        {teamMembers.map((teamMember) => (
          <Box
            key={teamMember.id}
            sx={{
              padding: '10px 15px',
              cursor: 'pointer',
              textAlign: 'center',
              '&:hover .avatar': {
                transform: 'scale(1.08)',
                filter: 'grayscale(0%)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={() => setSelectedTeamMember(teamMember)}
            data-testid="openMember"
          >
            <Avatar
              className="avatar"
              sx={{
                height: 110,
                width: 110,
                border:
                  teamMember === selectedTeamMember
                    ? '3px solid #4caf50'
                    : '2px solid #ccc',
                filter: 'grayscale(30%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                mx: 'auto',
              }}
              alt={teamMember.name}
              src={teamMember.imageURL}
            />
            <Box sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: 16 }}>
              {teamMember.name}
            </Box>
            <Box sx={{ fontWeight: 'medium' }}>{teamMember.location}</Box>
            <Box sx={{ fontSize: isMobile ? '9px' : '12px' }}>{teamMember.position}</Box>
          </Box>
        ))}
      </Grid>

      <Modal
        open={!!selectedTeamMember}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={!!selectedTeamMember}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 500 },
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(76, 175, 80, 0.4)',
              boxShadow: 24,
              borderRadius: 4,
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {selectedTeamMember?.name}
              </Typography>
              <Button
                onClick={handleClose}
                size="small"
                sx={{ minWidth: 0, padding: 0 }}
              >
                <HighlightOffOutlinedIcon sx={{ color: 'gray' }} />
              </Button>
            </Box>
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                {selectedTeamMember?.description}
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
