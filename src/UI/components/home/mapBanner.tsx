import { Paper, Typography, Box, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import router from 'next/router';
import { useState } from 'react';

export default function MapBanner() {
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
      <picture style={{width:'100%', height: 'fit-content', marginBottom: -15 }}>
        <img
          src={isMobile ? 'home/MapSmallMob.png': 'home/MapSmall.png'}
          style={{ width: '100%', borderRadius:'5px' }}
          alt="placeholder"
        />
        </picture>
        <div style={isMobile ? {position: 'absolute', display: 'flex', left: 0, bottom: '0.5vw', padding: 5, borderRadius: '5px' } :
          {position: 'absolute', display: 'flex', right: 0, bottom: '0.5vw', padding: 15, borderRadius: '5px' }
      }>
          <div style={ isMobile ? {display: 'flex', flexDirection:'column', alignItems:'start'} :
            {display: 'flex', flexDirection:'column', alignItems:'end'}
            }>
            <picture style={isMobile ? {display: 'flex', width:'30vw', padding:5,borderRadius: '5px'} : {width:'30vw'}}>
              <img
                src="/vector-atlas-logo.svg"
                style={{ width:'100%' }}
                alt="Vector Atlas logo"
              />
            </picture>
            <div style={isMobile ? {width:'60%', borderRadius: '5px'}: 
              {width:'70%',padding:'5px',paddingRight:0, marginTop: '5px', borderRadius: '5px'}
              }>
              <Typography variant="body1" sx={isMobile ? { textAlign:'left', borderRadius:'5px', fontSize:'1.5vw', marginTop: '5px', paddingLeft: 1} :
                { textAlign:'right', background: 'rgba(150, 180, 190, 0.9)', borderRadius:'5px', fontSize:'1.5vw', paddingLeft: 1}
                }>
                Analyses-ready data and spatial models tailored for malaria vector control
              </Typography>
            </div>
              <Button variant='contained' sx={ isMobile ? {display: 'flex', width:'30vw',alignItems: 'center', background: 'black', boxShadow:10,marginRight: 'auto', marginLeft:0 }:
                {display: 'flex', width:'22vw', alignItems: 'center', background: 'black', marginTop: '5px',marginLeft: 'auto', marginRight:0}
                }>
                <Typography noWrap variant="body1" sx={isMobile ? { fontSize:'2vw'} : 
                  {marginLeft:'10px', fontSize:'1.0vw'}}>
                  Explore the Data
                </Typography>
                {isMobile ? <></> :  <ArrowForwardIcon sx={{marginLeft:'10px', marginRight: '10px', fontSize: '2vw'}}/>}
              </Button>
          </div>
        </div>
        {isMobile ? <></> :
        <div style={{position: 'absolute', left: 0, bottom: 0, padding:15, width:'20vw'}}>
          <Button variant='contained' sx={{width:'100%'}}>
            <Typography variant='body2' sx={ 
              { padding:0, fontSize:'0.9vw'}}>
                Join mailing list
            </Typography>
          </Button>
          <Button variant='contained' color='secondary' sx={{width:'100%'}}>
            <Typography variant='body2' sx={
              { padding:0, fontSize:'0.9vw'}}>
                Find out more
            </Typography>
          </Button>
        </div>}
    </Paper>
  );
}

