import { Paper, Typography, Grid, Box, useTheme, useMediaQuery, Button } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import statsToggle from './statsToggle';
import StatsToggle from './statsToggle';
import { isMoreToggle } from '../../state/home/homeSlice';
import { useAppDispatch, useAppSelector } from '../../state/hooks';

export default function StatsBox() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const more = useAppSelector((s) => s.home.isMore);
  const dispatch = useAppDispatch();

  const handleMore = () => {
    dispatch(isMoreToggle())
  }

  const sx = {
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const paper = {
    marginTop: '1vw',
    paddingBottom: 2,
    '&:hover': {
      boxShadow: 10
    },
  }

  const statsBrowser = { width: 60, paddingTop: '5px' }
  const statsMobile = { width: 30, paddingTop: '15px' }
  const statsIconBrowser = {color:'primary.main', marginRight:5, fontSize: '4.5vw'};
  const statsIconMobile = {color:'primary.main', marginRight:5, fontSize: '7vw'};

  return (
    <Paper sx={paper}>
      <Box sx={{display:'flex', width: '100%', justifyContent: 'space-between', p:2, borderTopLeftRadius:'5px', borderTopRightRadius: '5px'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent: 'space-around', width: 'fit-content'}}>
          <AnalyticsIcon sx={isMobile ? statsIconMobile : statsIconBrowser}/>
          <Typography color="primary" variant="h4" sx={{fontSize:'5vw'}}>
            Statistics
          </Typography>
        </div>
      </Box>
      <Grid container justifyContent="space-evenly">
      <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
          <picture>
            <img
              src="download.svg"
              style={ isMobile ? statsMobile : statsBrowser }
              alt="placeholder"
            />
          </picture>
          <Typography color="black" variant="h5" sx={{fontSize:'3.5vw'}}>
            27
          </Typography>
          <Typography color="black" variant="h6" sx={{fontSize:'3.5vw'}}>
            Downloads
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
          <picture>
            <img
              src="datapoints.svg"
              style={ isMobile ? statsMobile : statsBrowser}
              alt="placeholder"
            />
          </picture>
          <Typography color="black" variant="h5" sx={{fontSize:'3.5vw'}}>
            6821
          </Typography>
          <Typography color="black" variant="h6" sx={{fontSize:'3.5vw'}}>
            Data Points
          </Typography>
        </Grid>
        {isMobile ?
        <>
          {more ? 
            <StatsToggle/> :  
            <Button onClick={handleMore}>
              <Typography sx={{fontSize:'3.5vw'}}>
                Show more
              </Typography>
            </Button>
          }
        </> :
        <StatsToggle/>
        }
      </Grid>
    </Paper>
  );
}
