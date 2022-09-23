import { Paper, Typography, Grid } from '@mui/material';

export default function StatsBox() {
  const sx = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Paper>
      <Grid container justifyContent="space-evenly" sx={{maxHeight: '400px'}}>
        <Grid item xs={4} sx={sx}>
          <picture>
            <img src='africa.svg' style={{width: '100%', maxHeight: '150px', paddingTop: '5px'}} alt="placeholder"/>
          </picture>
          <Typography color="primary" variant="body1">
            Some statistic
          </Typography>
        </Grid>
        <Grid item xs={4} sx={sx}>
          <picture>
            <img src='testtube.svg' style={{width: '100%', maxHeight: '150px', paddingTop: '5px'}} alt="placeholder"/>
          </picture>
          <Typography color="info" variant="body1">
            Some other statistic
          </Typography>
        </Grid>
        <Grid item xs={4} sx={sx}>
          <picture>
            <img src='mosquito.svg' style={{width: '100%', maxHeight: '150px', paddingTop: '5px'}} alt="placeholder"/>
          </picture>
          <Typography color="secondary" variant="body1">
            Some third statistic
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
