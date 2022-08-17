import {
  Paper,
  Typography,
  Box,
  Grid
} from '@mui/material';

export default function AboutPartner() {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'justify-between',
        alignItems: 'left',
      }}
    >
      <Typography variant='h5' color='primary' mt='20px' pl='15px' mb='5px'>
        Our Partners
      </Typography>
      <Box p='15px' sx={{width:1,}}>
        <Grid p='15px' container sx={{width:1,}} spacing={15} alignItems='center'>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <a href='http://www.icipe.org/' target='_blank' rel="noreferrer">
              <Box sx={{cursor:'pointer'}}>
                <img src='http://www.icipe.org/sites/default/files/icipe-logo-web-280px.png' height='70' alt='icipe' ></img>
              </Box>
            </a>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <a href='https://www.ox.ac.uk/' target='_blank' rel="noreferrer">
              <Box sx={{cursor:'pointer'}}>
                <img src='https://logodownload.org/wp-content/uploads/2020/12/university-of-oxford-logo.png' height='70' alt='University of Oxford' ></img>
              </Box>
            </a>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <a href='https://malariaatlas.org/' target='_blank' rel="noreferrer">
              <Box sx={{cursor:'pointer'}}>
                <img src='https://malariaatlas.org/wp-content/themes/map-wordpress/dist/images/malaria_atlas_project_logo.png' height='70' alt='Malaria Atlas Project'></img>
              </Box>
            </a>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <a href='https://www.pamca.org/en' target='_blank' rel="noreferrer">
              <Box sx={{cursor:'pointer',backgroundColor:'black', padding:1}}>
                <img src='https://www.pamca.org/themes/pamca/assets/front_end/img/logo-default-slim-dark-small.png' height='70' alt='PAMCA'></img>
              </Box>
            </a>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <a href='https://www.gbif.org/' target='_blank' rel="noreferrer">
              <Box sx={{cursor:'pointer'}}>
                <img src='https://docs.gbif.org/style/logo.svg' height='70' alt='GBIF'></img>
              </Box>
            </a>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <a href='https://vectorbase.org/vectorbase/app' target='_blank' rel="noreferrer">
              <Box sx={{cursor:'pointer'}}>
                <img src='https://vectorbase.org/a/images/VEuPathDB/Logos-color-text-web/vectorbase.png'  height='70' alt='VectorBase'></img>
              </Box>
            </a>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <a href='https://www.irmapper.com/' target='_blank' rel="noreferrer">
              <Box sx={{cursor:'pointer'}}>
                <img src='https://www.irmapper.com/img/logo1.png'  height='70'  alt='IRMapper'></img>
              </Box>
            </a>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <a href='https://www.gatesfoundation.org/' target='_blank' rel="noreferrer">
              <Box sx={{cursor:'pointer'}}>
                <img src='https://www.gatesfoundation.org/-/media/logos/logolg.svg'  height='70' alt='BMGF'></img>
              </Box>
            </a>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
/* 
(icipe, University of Oxford, MAP, PAMCA, GBIF, VectorBase, IRMapper, BMGF) */
/* 
next config for <Image/> */

{
  /* <Image src='http://www.icipe.org/sites/default/files/icipe-logo-web-280px.png' alt='icipe' layout='fill'/> */
}
