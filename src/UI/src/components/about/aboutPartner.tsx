import { Box, Grid } from '@mui/material';
import data from './data/partners.json';
import AboutPartnerPanel from './aboutPartnerPanel';

export default function AboutPartner() {
  const allPartners = data.partnerList;
  return (
    <Box p="15px" sx={{ width: 1 }}>
      <Grid data-testid="partnerListContainer" container alignItems="center">
        {allPartners.map((partner) => (
          <AboutPartnerPanel key={partner.id} {...partner} />
        ))}
      </Grid>
    </Box>
  );
}
