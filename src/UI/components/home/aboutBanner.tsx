import { Paper, Typography, Box, Button, Grid } from '@mui/material';
import Link from 'next/link';

export default function AboutBanner() {
  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'justify-between',
        alignItems: 'center',
      }}>
      <Grid container>
        <Grid item lg={4} md={6} sm={12}>
          <Typography variant='h4' color='primary' py='25px' px='25px'>
              Analyses-Ready Data and Spatial Models Specifically Tailored to Inform Malaria Vector Control
          </Typography>
        </Grid>
        <Grid item lg={8} md={6} sm={12}>
          <Box px='25px' py='25px'>
            <Typography mb='25px' variant='body1' textAlign='justify'>
                The Vector Atlas brings together a new collaboration of partners (icipe, University of Oxford, MAP, PAMCA, GBIF, VectorBase, IRMapper, BMGF) in an initiative to build an online, open access
                repository to hold and share our analyses-ready malaria vector occurrence, bionomics, abundance, and insecticide resistance data. Our data will be fully up to date and form the basis of a
                series of spatial models specifically tailored to inform the control of mosquito vectors of disease.
            </Typography>
            <Grid container justifyContent='flex-end'>
              <Link href="mailto:vectoratlas@outlook.com?subject=Joining the Vector Atlas mailing list" passHref>
                <Button variant='contained'>Join Mailing List</Button>
              </Link>
              <Link href="/about" passHref>
                <Button variant='outlined'>Find out more</Button>
              </Link>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
