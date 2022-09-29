import { Typography, Box, Grid } from '@mui/material';
import data from './data/contacts.json';
import AboutOfficePanel from './aboutOfficePanel';
import AboutFieldStationPanel from './aboutFieldStationPanel';

export default function AboutContact() {
  const officeList = data.offices;
  const fieldList = data.fieldStations;
  return (
    <Box p='35px' sx={{ width: 1 }}>
      <Grid container sx={{ fontFamily: 'sans-serif' }} spacing={8} alignItems='start' justifyContent='center'>
        <Grid container item md={6} sm={12}>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>Head Office</Typography>
            <Box data-testid='officeListContainer'>
              {officeList.map((office) => (
                <AboutOfficePanel key={office.id} {...office} />
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid container item md={6} sm={12}>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>Field Stations</Typography>
            <Box data-testid='fieldStationListContainer'>
              {fieldList.map((station) => (
                <AboutFieldStationPanel key={station.id} {...station} />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
