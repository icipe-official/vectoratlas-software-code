import {
  Paper,
  Typography,
  Divider,
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
        alignItems: 'center',
      }}
    >
      <Typography variant='h5' color='primary' mt='20px'>
        Partners
      </Typography>
      <Divider orientation='vertical' flexItem />
      <Box p='15px' sx={{width:1,}}>
        <Grid p='15px' container sx={{width:1,}} spacing={15} alignItems="center">
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <img src='http://www.icipe.org/sites/default/files/icipe-logo-web-280px.png' height='70' alt='icipe' ></img>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <img src='https://www.ox.ac.uk/sites/default/themes/custom/oxweb/images/oxweb-logo.gif' height='70' alt='University of Oxford' ></img>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <img src='https://malariaatlas.org/wp-content/themes/map-wordpress/dist/images/malaria_atlas_project_logo.png' height='70' alt='Malaria Atlas Project'></img>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <Box sx={{backgroundColor:'black', padding:1}}>
              <img src='https://www.pamca.org/themes/pamca/assets/front_end/img/logo-default-slim-dark-small.png' height='70' alt='PAMCA'></img>
            </Box>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <img src='https://docs.gbif.org/style/logo.svg' height='70' alt='GBIF'></img>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <img src='https://vectorbase.org/a/images/VEuPathDB/Logos-color-text-web/vectorbase.png'  height='70' alt='VectorBase'></img>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <img src='https://www.irmapper.com/img/logo1.png'  height='70'  alt='IRMapper'></img>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <img src='https://www.gatesfoundation.org/-/media/logos/logolg.svg'  height='70' alt='BMGF'></img>
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
