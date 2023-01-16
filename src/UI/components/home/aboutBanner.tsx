import { Paper, Typography, Box, Button, Grid } from '@mui/material';
import Link from 'next/link';
import MapIcon from '@mui/icons-material/Map';

export default function AboutBanner() {
/*   const homeMapButton = {
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      borderRadius: '40%',
    },
  }; */
  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        background: 'primary.main',
        alignItems: 'center',
      }}
    >
      <picture style={{width:'100%', marginBottom:-10 }}>
        <img
          src={'home/Map.png'}
          style={{ width: '100%', borderRadius:'5px' }}
          alt="placeholder"
        />
        </picture>
        <div style={{position: 'absolute', display: 'flex', justifyContent: 'space-between', width:'40%', right: 20, bottom: 50, background: 'white', padding: 20, borderRadius: '5px' }}>
          <div style={{display:'flex'}}>
            <Box sx={{backgroundColor:'secondary.main', height: '100%', width: 10, marginRight: 1, borderRadius:'5px'}}></Box>
            <Box sx={{backgroundColor:'primary.main', height: '90%', width: 10, marginRight: 1, borderRadius:'5px'}}></Box>
          </div>
          <div style={{marginRight: 20}}>
            <picture>
              <img
                src="/vector-atlas-logo.svg"
                style={{ width:'100%' }}
                alt="Vector Atlas logo"
              />
            </picture>
            <div style={{padding:'10px', marginTop: '5px', borderRadius: '5px', width: 'fit-content', marginLeft: 'auto'}}>
              <Typography variant="h5">
                Data and spatial models tailored for malaria vector control
              </Typography>
            </div>
            <Link href="/map" passHref>
              <Button variant='contained' sx={{display: 'flex', alignItems: 'center', background: 'black', padding:'10px',marginTop: '5px',width: 'fit-content', marginLeft: 'auto'}}>
                <Typography variant="h5">
                  Go to map 
                </Typography>
                <MapIcon sx={{margin:'10px'}}/>
              </Button>
            </Link>
          </div>
        </div>
    </Paper>
  );
}

