import { Paper, Typography, Box, Button, Grid } from '@mui/material';
import Link from 'next/link';
import MapIcon from '@mui/icons-material/Map';
import router from 'next/router';

export default function AboutBanner() {

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
      <picture style={{width:'100%', marginBottom: -6 }}>
        <img
          src={'home/MapSmall.png'}
          style={{ width: '100%', borderRadius:'5px' }}
          alt="placeholder"
        />
        </picture>
        <div style={{position: 'absolute', display: 'flex', justifyContent: 'end', width:'fit-content', right: 20, bottom: 50, background: 'rgba(256,256,256,0)', padding: 20, borderRadius: '5px' }}>
          {/* <div style={{display:'flex'}}>
            <Box sx={{backgroundColor:'secondary.main', height: '100%', width: 10, marginRight: 1, borderRadius:'5px'}}></Box>
            <Box sx={{backgroundColor:'primary.main', height: '90%', width: 10, marginRight: 1, borderRadius:'5px'}}></Box>
          </div> */}
          <div style={{display: 'flex', flexDirection:'column', alignItems:'end'}}>
            <picture>
              <img
                src="/vector-atlas-logo.svg"
                style={{ width:'100%' }}
                alt="Vector Atlas logo"
              />
            </picture>
            <div style={{padding:'5px', paddingRight:0, marginTop: '5px', borderRadius: '5px', width: 'fit-content', marginLeft: 'auto'}}>
              <Typography variant="body1">
                Analyses-ready data and spatial models tailored for malaria vector control
              </Typography>
            </div>
              <Button variant='contained' sx={{display: 'flex', alignItems: 'center', background: 'black', padding:'px',marginTop: '5px',width: 'fit-content', marginLeft: 'auto'}}>
                <Typography variant="body1" sx={{marginLeft:'10px'}}>
                  Explore the data
                </Typography>
                <MapIcon sx={{marginLeft:'10px', marginRight: '10px'}}/>
              </Button>
          </div>
        </div>
    </Paper>
  );
}

