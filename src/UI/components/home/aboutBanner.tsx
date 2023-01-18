import { Paper, Typography, Box, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import MapIcon from '@mui/icons-material/Map';
import router from 'next/router';
import { useState } from 'react';

export default function AboutBanner() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => {
    router.push('/map')
  };
  
  return (
    <Paper
      sx={{
        display: 'flex',
        position: 'relative',
        background: 'primary.main',
        boxShadow: 5,
        marginBottom: 2,
        '&:hover': {
          cursor: 'pointer',
          boxShadow: 10
        },
      }}
      onClick={handleClick}
    >
      <picture style={{width:'100%', height: 'fit-content', marginBottom: -6 }}>
        <img
          src={'home/MapSmall.png'}
          style={{ width: '100%', borderRadius:'5px' }}
          alt="placeholder"
        />
        </picture>
        <div style={{position: 'absolute', display: 'flex', justifyContent: 'end', right: 20, bottom: '0.5vw', background: 'rgba(256,256,256,0)', padding: 20, borderRadius: '5px' }}>
          <div style={{display: 'flex', flexDirection:'column', alignItems:'end'}}>
            <picture style={{width:'30vw'}}>
              <img
                src="/vector-atlas-logo.svg"
                style={{ width:'100%' }}
                alt="Vector Atlas logo"
              />
            </picture>
            <div style={{width:'70%',padding:'5px',paddingRight:0, marginTop: '5px', borderRadius: '5px', marginLeft: 'auto'}}>
              <Typography variant="body1" sx={{ textAlign:'right', background: 'rgba(150, 180, 190, 0.5)', borderRadius:'5px', paddingX: 1, fontSize:'1.5vw'}}>
                Analyses-ready data and spatial models tailored for malaria vector control
              </Typography>
            </div>
              <Button variant='contained' sx={{display: 'flex', width:'30vw',alignItems: 'center', background: 'black', padding:'px',marginTop: '5px',marginLeft: 'auto'}}>
                <Typography noWrap variant="body1" sx={{marginLeft:'10px', fontSize:'1.5vw', overflow: "hidden", textOverflow: "ellipsis"}}>
                  Explore the Data
                </Typography>
                <MapIcon sx={{marginLeft:'10px', marginRight: '10px', fontSize: '2vw'}}/>
              </Button>
              {isMobile ? <div>T</div> : <></>}
          </div>
        </div>
    </Paper>
  );
}

