import {
  Paper,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import StatsToggle from './statsToggle';
import { showMoreToggle } from '../../../state/home/homeSlice';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import React, { useEffect } from 'react';
import { getHomepageStats } from '../../../state/home/actions/getHomepageStats';

export default function StatsBox() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();

  const more = useAppSelector((s) => s.home.showMore);
  const stats = useAppSelector((s) => s.home.stats);
  const serverUp = useAppSelector((s) => s.home.serverUp);

  const handleMore = () => {
    dispatch(showMoreToggle());
  };

  useEffect(() => {
    dispatch(getHomepageStats());
  }, [dispatch]);

  const sx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const paper = {
    marginTop: '1vw',
    paddingBottom: 1,
    '&:hover': {
      boxShadow: 10,
    },
  };
  if(serverUp===false){
    return <></>
  } else {
      
    return (
      <Paper sx={paper} >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            p: 1,
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: 'fit-content',
            }}
          >
          </div>
        </Box>
        <Grid container justifyContent="space-evenly">
          <Grid item xs={6} sm={4} md={4} lg={2} sx={sx} flexDirection={'column'}>
            <Typography
              color="black"
              variant="h2"
              sx={{ fontSize: '3.5vw' }}
            >
              {stats.recordsTotal}
            </Typography>
            <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
              vector records
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
            <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
              visited...
            </Typography>
            <Typography color="primary" variant="h3" sx={{ fontSize: '3.5vw' }}>
              {stats.pageViews}
            </Typography>
            <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
              times
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={4} lg={2} sx={sx}>
            <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
              by..
            </Typography>
            <Typography color="primary" variant="h3" sx={{ fontSize: '3.5vw' }}>
              {stats.uniqueViews}
            </Typography>
            <Typography color="black" variant="h6" sx={{ fontSize: '3.5vw' }}>
              {stats.uniqueViews === 1 ? 'vistor' : 'visitors'}
            </Typography>
          </Grid>
          {isMobile ? (
            <>
              {more ? (
                <StatsToggle />
              ) : (
                <Button
                  onClick={handleMore}
                  sx={{ marginBottom: 0, paddingBottom: 0 }}
                >
                  <Typography sx={{ fontSize: '3.5vw' }}>Show more...</Typography>
                </Button>
              )}
            </>
          ) : (
            <StatsToggle />
          )}
        </Grid>
      </Paper>
    );
  }
}
