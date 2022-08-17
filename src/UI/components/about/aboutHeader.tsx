import { Paper, Typography, Divider, Box, Link } from '@mui/material';

export default function AboutHeader() {
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
        About
      </Typography>
      <Divider orientation='horizontal' flexItem />
      <Box p='15px'>
        <Typography variant='body1' textAlign='justify'>
          The Vector Atlas brings together a new collaboration of partners
          (icipe, University of Oxford, MAP, PAMCA, GBIF, VectorBase, IRMapper,
          BMGF) in an initiative to build an online, open access repository to
          hold and share our analyses-ready malaria vector occurrence,
          bionomics, abundance, and insecticide resistance data. Our data will
          be fully up to date and form the basis of a series of spatial models
          specifically tailored to inform the control of mosquito vectors of
          disease.
          <br></br>
          <br></br>
          The data used to create the map layers, consisting of the the spatial model outputs, can be downloaded from the homepage. You can also upload data of your own to help with our mission - advice and guidelines for 
          the uploading of data can be found <Link href='#' underline='always' >  {'here'}</Link>.
        </Typography>
      </Box>
    </Paper>
  );
}
