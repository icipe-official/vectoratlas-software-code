import {
  Paper,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import {dummyContact} from './dummyState';
import AboutOfficePanel from './aboutOfficePanel';
import AboutFieldStationPanel from './aboutFieldStationPanel';



export default function AboutContact() {
  const contactList = dummyContact;
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h5' color='primary' mt='20px' pl='15px' mb='5px'>
        Contact Us
      </Typography>
      <Box p='15px' sx={{width:1}}>
        <Grid p='15px' container sx={{ fontFamily:'sans-serif'}} spacing={8} alignItems='center' justifyContent="center">
          <Grid container item sx={{width:1/2, justifyContent:'center'}}>
            <Box >
              <Typography sx={{fontWeight:'bold'}}>Head Office</Typography>
              { contactList.offices.map(office => (
                <AboutOfficePanel key={office.id} name={office.name} address={office.address} tel={office.tel} fax={office.fax} email={office.email}/>
              ))}
            </Box>
          </Grid>
          <Grid container item sx={{width:1/2, justifyContent:'center'}}>
            <Box>
              <Typography sx={{fontWeight:'bold'}}>Field Stations</Typography>
              { contactList.fieldStations.map(station => (
                <AboutFieldStationPanel key={station.id} name={station.name} tel={station.tel} fax={station.fax} physicalLoc={station.physicalLoc}/>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

