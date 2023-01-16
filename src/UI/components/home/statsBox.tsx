import { Paper, Typography, Grid, Box } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function StatsBox() {
  const sx = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <Paper>
      <Box sx={{display:'flex', width: '100%', justifyContent: 'space-between', p:2, backgroundColor:'gray', borderTopLeftRadius:'5px', borderTopRightRadius: '5px'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent: 'space-around', width: 'fit-content'}}>
          <AnalyticsIcon fontSize='large' sx={{color:'secondary.main', marginRight:5}}/>
          <Typography color="secondary" variant="h4">
            Statistics
          </Typography>
        </div>
      </Box>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} sm={6} md={4} lg={6} sx={sx}>
          <picture>
            <img
              src="africa.svg"
              style={{ width: 100, maxHeight: '100px', paddingTop: '5px' }}
              alt="placeholder"
            />
          </picture>
          <Typography color="primary" variant="body1">
            Some statistic
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={6} sx={sx}>
          <picture>
            <img
              src="testtube.svg"
              style={{ width: 100, maxHeight: '100px', paddingTop: '5px' }}
              alt="placeholder"
            />
          </picture>
          <Typography color="info" variant="body1">
            Some other statistic
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={6} sx={sx}>
          <picture>
            <img
              src="mosquito.svg"
              style={{ width: 100, maxHeight: '100px', paddingTop: '5px' }}
              alt="placeholder"
            />
          </picture>
          <Typography color="secondary" variant="body1">
            Some third statistic
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
