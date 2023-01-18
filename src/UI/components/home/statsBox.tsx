import { Paper, Typography, Grid, Box, Button } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function StatsBox() {
  const sx = {
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const paper = {
    paddingBottom: 2,
    '&:hover': {
      boxShadow: 10
    },
  }

  return (
    <Paper sx={paper}>
      <Box sx={{display:'flex', width: '100%', justifyContent: 'space-between', p:2, borderTopLeftRadius:'5px', borderTopRightRadius: '5px'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent: 'space-around', width: 'fit-content'}}>
          <AnalyticsIcon fontSize='large' sx={{color:'primary.main', marginRight:5}}/>
          <Typography color="primary" variant="h4">
            Your Vector Atlas...
          </Typography>
        </div>
      </Box>
      <Grid container justifyContent="space-evenly">
      <Grid item xs={12} sm={6} md={4} lg={2} sx={sx}>
          {/* <picture>
            <img
              src="download.svg"
              style={{ width: 100, maxHeight: '100px', paddingTop: '5px' }}
              alt="placeholder"
            />
          </picture> */}
          <Typography color="secondary" variant="h5">
            27
          </Typography>
          <Typography color="secondary" variant="h6">
            Downloads
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2} sx={sx}>
          {/* <picture>
            <img
              src="circleDot.svg"
              style={{ width: 100, maxHeight: '100px', paddingTop: '5px' }}
              alt="placeholder"
            />
          </picture> */}
          <Typography color="black" variant="h5">
            6821
          </Typography>
          <Typography color="black" variant="h6">
            Data Points
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2} sx={sx}>
          {/* <picture>
            <img
              src="africa.svg"
              style={{ width: 100, maxHeight: '100px', paddingTop: '5px' }}
              alt="placeholder"
            />
          </picture> */}
          <Typography color="primary" variant="h5">
            13
          </Typography>
          <Typography color="primary" variant="h6">
            Countries
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2} sx={sx}>
          {/* <picture>
            <img
              src="testtube.svg"
              style={{ width: 100, maxHeight: '100px', paddingTop: '5px' }}
              alt="placeholder"
            />
          </picture> */}
          <Typography color="gray" variant="h5">
            4
          </Typography>
          <Typography color="gray" variant="h6">
            Citations
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2} sx={sx}>
          {/* <picture>
            <img
              src="mosquito.svg"
              style={{ width: 100, maxHeight: '100px', paddingTop: '5px' }}
              alt="placeholder"
            />
          </picture> */}
          <Typography color="secondary" variant="h5">
            25
          </Typography>
          <Typography color="secondary" variant="h6">
            Species
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
