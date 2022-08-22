import { Typography, Box, Grid } from '@mui/material';
import { contacts } from './data/contacts';
import AboutOfficePanel from './aboutOfficePanel';
import AboutFieldStationPanel from './aboutFieldStationPanel';

export default function AboutContact() {
  const contactList = contacts;
  return (
    <Box p='35px' sx={{ width: 1 }}>
      <Grid container sx={{ fontFamily: 'sans-serif' }} spacing={8} alignItems='start' justifyContent='center'>
        <Grid container item sx={{ width: 1 / 2, justifyContent: 'center' }}>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>Head Office</Typography>
            <Box data-testid='officeListContainer'>
              {contactList.offices.map((office) => (
                <AboutOfficePanel key={office.id} {...office} />
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid container item sx={{ width: 1 / 2, justifyContent: 'center' }}>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>Field Stations</Typography>
            <Box data-testid='fieldStationListContainer'>
              {contactList.fieldStations.map((station) => (
                <AboutFieldStationPanel key={station.id} {...station} />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
