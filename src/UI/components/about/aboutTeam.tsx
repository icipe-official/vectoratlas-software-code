import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Grid,
  Collapse,
  Card,
  CardContent,
} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
const { autoPlay } = require('react-swipeable-views-utils');
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import data from './data/team.json';

type TeamMember = {
  id?: string | number;
  name: string;
  location?: string;
  description?: string;
  imageURL: string;
};

const ControlledAutoPlaySwipeableViews = autoPlay(SwipeableViews);

const TeamCard: React.FC<{
  member: TeamMember;
  isExpanded: boolean;
  onToggle: (id: string | number) => void;
}> = ({ member, isExpanded, onToggle }) => {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: { xs: 280, sm: 250, md: 280 },
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'visible',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease-in-out',
        border: '2px solid transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 30px rgba(76, 175, 80, 0.15)',
          border: '2px solid #e8f5e8',
        },
      }}
    >
      <Box
        onClick={() => onToggle(member.id!)}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 200, sm: 220, md: 240 },
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: '12px 12px 0 0',
          '&:hover .imageOverlay': { opacity: 1 },
          '&:hover .hoverContent': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        }}
      >
        <Avatar
          src={member.imageURL}
          alt={member.name}
          variant="square"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 0,
          }}
        />
        <Box
          className="imageOverlay"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(111, 162, 114, 0.59)',
            opacity: 0,
            transition: 'all 0.4s ease-in-out',
          }}
        />
        <Box
          className="hoverContent"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#ffffff',
            opacity: 0,
            px: 2,
            py: 1,
            textAlign: 'center',
            transition: 'all 0.4s ease-in-out',
            transform: 'translateY(20px)',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mb: 18,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            {member.name}
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              backgroundColor: '#ffffff',
              color: '#2e7d32',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '25px',
              textTransform: 'none',
              border: '2px solid #ffffff',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'scale(1.05)',
              },
            }}
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </Button>
        </Box>
      </Box>

      <Collapse in={isExpanded} timeout={400}>
        <CardContent
          sx={{
            backgroundColor: '#f8fdf8',
            borderTop: '2px solid #e8f5e8',
            p: { xs: 2, sm: 3 },
          }}
        >
          <Typography variant="subtitle1" color="#4caf50" fontWeight={600}>
            {member.name}
          </Typography>
          <Typography variant="body2" color="#2e7d32" mb={2}>
            📍 {member.location}
          </Typography>
          <Typography variant="body2" color="#424242" textAlign="left">
            {member.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default function AboutTeam() {
  const teamMembers: TeamMember[] = data.teamList;
  const [index, setIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlay] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<string | number, boolean>>({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getItemsPerGroup = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const itemsPerGroup = getItemsPerGroup();
  const groupedMembers: TeamMember[][] = [];
  for (let i = 0; i < teamMembers.length; i += itemsPerGroup) {
    groupedMembers.push(teamMembers.slice(i, i + itemsPerGroup));
  }

  const handleToggleExpand = (id: string | number) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Box sx={{ py: 5, px: 2, backgroundColor: '#f0f8f0', minHeight: '100vh' }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" textAlign="center" mb={4}>
        Meet the Team
      </Typography>

      <Box maxWidth={1200} mx="auto" px={2} position="relative">
        <ControlledAutoPlaySwipeableViews
          index={index}
          onChangeIndex={setIndex}
          enableMouseEvents
          interval={5000}
          autoplay={autoPlayEnabled}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {groupedMembers.map((group, groupIdx) => (
            <Grid container spacing={3} key={groupIdx} justifyContent="center">
              {group.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <TeamCard
                    member={member}
                    isExpanded={!!expandedIds[member.id!]}
                    onToggle={handleToggleExpand}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </ControlledAutoPlaySwipeableViews>

        {groupedMembers.length > 1 && (
          <>
            <IconButton
              onClick={() => setIndex((prev) => (prev - 1 + groupedMembers.length) % groupedMembers.length)}
              sx={{
                position: 'absolute',
                top: '40%',
                left: -20,
                transform: 'translateY(-50%)',
                backgroundColor: '#fff',
                border: '2px solid #e8f5e8',
                color: '#2e7d32',
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => setIndex((prev) => (prev + 1) % groupedMembers.length)}
              sx={{
                position: 'absolute',
                top: '40%',
                right: -20,
                transform: 'translateY(-50%)',
                backgroundColor: '#fff',
                border: '2px solid #e8f5e8',
                color: '#2e7d32',
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
        {groupedMembers.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => setIndex(idx)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: index === idx ? '#4caf50' : '#c8e6c9',
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
