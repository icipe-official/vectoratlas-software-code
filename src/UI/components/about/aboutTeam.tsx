import {
  Paper,
  Typography,
  Box,
  Grid,
  Avatar
} from '@mui/material';

export default function AboutTeam() {
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
        The Team
      </Typography>
      <Box p='15px' sx={{width:1,}}>
        <Grid p='15px' container sx={{width:1, fontFamily:'sans-serif'}} spacing={15} alignItems='center'>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <Box sx={{display:'inline-flex',width:1,cursor:'pointer', padding:2, borderRadius:5, border:2,borderColor:'primary.main'}}>
              <Grid container sx={{width:1/2, justifyContent:'center', alignItems:'center'}}>
                <Avatar sx={{height:150, width:150}} alt='Simon Baker' src='https://images.rawpixel.com/image_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvay1zMzEtZHNjMTU1NDk0Ny0xLmpwZw.jpg'/>
              </Grid>
              <Grid container sx={{display:'inline-flex',flexDirection:'column',width:1/2, justifyContent:'center'}}>
                <Box sx={{fontWeight:'bold', color:'primary.main'}}>Lan M. Medina</Box>
                <Box sx={{fontWeight:'Medium',marginBottom:2}}>Kenya</Box>
                <Box sx={{fontSize:'12px'}}> Postdoctoral Fellow, Molecular Biology, Bioinformatics and Biostatistics</Box>
              </Grid>
            </Box>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <Box sx={{display:'inline-flex',width:1,cursor:'pointer', padding:2, borderRadius:5, border:2,borderColor:'primary.main'}}>
              <Grid container sx={{width:1/2, justifyContent:'center', alignItems:'center'}}>
                <Avatar sx={{height:150, width:150}} alt='Simon Baker' src='https://images.rawpixel.com/image_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvMzI0LW1ja2luc2V5LTEzOS5qcGc.jpg'/>
              </Grid>
              <Grid container sx={{display:'inline-flex',flexDirection:'column',width:1/2, justifyContent:'center'}}>
                <Box sx={{fontWeight:'bold', color:'primary.main'}}>Cynthia P. Craig</Box>
                <Box sx={{fontWeight:'Medium',marginBottom:2}}>Nigeria</Box>
                <Box sx={{fontSize:'12px'}}> Research Scientist, Data Management, Modelling and Geo-Information Unit</Box>
              </Grid>
            </Box>
          </Grid>
          <Grid container item sx={{width:1/3, justifyContent:'center'}}>
            <Box sx={{display:'inline-flex',width:1,cursor:'pointer', padding:2, borderRadius:5, border:2,borderColor:'primary.main'}}>
              <Grid container sx={{width:1/2, justifyContent:'center', alignItems:'center'}}>
                <Avatar sx={{height:150, width:150}} alt='Amy Rand' src='https://images.rawpixel.com/image_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1LzQ0NS1tY2tpbnNleS0wNDc3LXBhaV8xLmpwZw.jpg'/>
              </Grid>
              <Grid container sx={{display:'inline-flex',flexDirection:'column',width:1/2, justifyContent:'center'}}>
                <Box sx={{fontWeight:'bold', color:'primary.main'}}>Christine H. Garza</Box>
                <Box sx={{fontWeight:'Medium',marginBottom:2}}>Uganda</Box>
                <Box sx={{fontSize:'12px'}}> Project Accounting Manager, Finance and Administration Department</Box>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

