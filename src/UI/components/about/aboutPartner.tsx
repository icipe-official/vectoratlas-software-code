import { Paper, Typography, Box, Grid } from '@mui/material';
import { partners } from './data/partners';
import AboutPartnerPanel from './aboutPartnerPanel';

export default function AboutPartner() {
  const allPartners = partners.partnerList;
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'justify-between',
        alignItems: 'left',
      }}>
      <Typography variant='sectionTitle' color='primary'>
        Our Partners
      </Typography>
      <Box p='35px' sx={{ width: 1 }}>
        <Grid data-testid='partnerListContainer' container sx={{ width: 1 }} spacing={15} alignItems='center'>
          {allPartners.map((partner) => (
            <AboutPartnerPanel key={partner.id} {...partner} />
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
