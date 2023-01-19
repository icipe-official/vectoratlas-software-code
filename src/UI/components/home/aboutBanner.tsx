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
          src={isMobile ? 'home/MapSmallMob.png': 'home/MapSmall.png'}
          style={{ width: '100%', borderRadius:'5px' }}
          alt="placeholder"
        />
        </picture>
        <div style={{position: 'absolute', display: 'flex', justifyContent: 'end', right: 0, bottom: '0.5vw', background: 'rgba(256,256,256,0)', padding: 15, borderRadius: '5px' }}>
          <div style={{display: 'flex', flexDirection:'column', alignItems:'end'}}>
            {isMobile ? <></> :
            <picture style={{width:'30vw'}}>
              <img
                src="/vector-atlas-logo.svg"
                style={{ width:'100%' }}
                alt="Vector Atlas logo"
              />
            </picture>
            }
            <div style={isMobile ? {width:'100%',padding:'5px',paddingRight:0, marginTop: '5px', borderRadius: '5px'} : 
              {width:'70%',padding:'5px',paddingRight:0, marginTop: '5px', borderRadius: '5px'}}>
              {isMobile ? 
                <div style={{width:'100%'}}>
                  <div style={{display:'flex', background:'rgb(3, 133, 67)', borderRadius:'5px', marginBottom:3, width: 'fit-content'}}>
                    <picture style={{display: 'flex', alignItems:'center'}}>
                      <img
                      src="mosquito.svg"
                      style={{ width: 20, paddingTop: '2px',margin:'2px' }}
                      alt="placeholder"
                    />
                    </picture>
                    <Typography style={{paddingRight:2}}>Malaria Vector Control</Typography>
                  </div>
                  <div style={{display:'flex', background:'rgb(3, 133, 67)', borderRadius:'5px', marginBottom:3, width: 'fit-content'}}>
                    <picture style={{display: 'flex', alignItems:'center'}}>
                      <img
                      src="mosquito.svg"
                      style={{ width: 20, paddingTop: '2px',margin:'2px' }}
                      alt="placeholder"
                    />
                    </picture>
                    <Typography style={{paddingRight:2}}>Analysis Ready Data</Typography>
                  </div>
                  <div style={{display:'flex', background:'rgb(3, 133, 67)', borderRadius:'5px', marginBottom:3, width: 'fit-content'}}>
                    <picture style={{display: 'flex', alignItems:'center'}}>
                      <img
                      src="mosquito.svg"
                      style={{ width: 20, paddingTop: '2px',margin:'2px' }}
                      alt="placeholder"
                    />
                    </picture>
                    <Typography style={{paddingRight:2}}>Spatial Models</Typography>
                  </div>

                </div>:
                <Typography variant="body1" sx={{ textAlign:'right', background: 'rgba(150, 180, 190, 0.5)', borderRadius:'5px', paddingX: 1, fontSize:'1.5vw'}}>
                  Analyses-ready data and spatial models tailored for malaria vector control
                </Typography>
              } 
            </div>
              <Button variant='contained' sx={{display: 'flex', width:'30vw',alignItems: 'center', background: 'black', padding:'px',marginTop: '5px',marginLeft: 'auto'}}>
                <Typography noWrap variant="body1" sx={isMobile ? { fontSize:'2vw'} : 
                  {marginLeft:'10px', fontSize:'1.5vw'}}>
                  Explore the Data
                </Typography>
                {isMobile ? <></> :  <MapIcon sx={{marginLeft:'10px', marginRight: '10px', fontSize: '2vw'}}/>}
              </Button>
              {isMobile ? <div></div> : <></>}
          </div>
        </div>
    </Paper>
  );
}

