import {
  Paper,
  Typography,
  Box,
  Grid
} from '@mui/material';
import {dummyPartners} from './dummyState';
import AboutPartnerPanel from './aboutPartnerPanel';

export default function AboutPartner() {
  const partnerList = dummyPartners.partners;
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'justify-between',
        alignItems: 'left',
      }}
    >
      <Typography variant='h5' color='primary' mt='25px' px='35px'>
        Our Partners
      </Typography>
      <Box p='35px' sx={{width:1,}}>
        <Grid data-testid='partnerListContainer' container sx={{width:1,}} spacing={15} alignItems='center'>
          { partnerList.map(partner => (
            <AboutPartnerPanel key={partner.id} id ={partner.id}name={partner.name} homepage={partner.homepage} imageURL={partner.imageURL} />
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
