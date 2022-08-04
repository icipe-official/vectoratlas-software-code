import { Paper, Typography, Divider, Box, Button, Grid } from "@mui/material";

export default function StatsBox() {
  const sx = {
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Paper>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={4} sx={sx} direction="column">
          <picture>
            <img src='africa.svg' style={{maxHeight: '150px'}}/>
          </picture>
          <Typography color="primary" variant="body1">
            Some statistic
          </Typography>
        </Grid>
        <Grid item xs={4} sx={sx} direction="column">
          <picture>
            <img src='testtube.svg' style={{maxHeight: '150px'}}/>
          </picture>
          <Typography color="info" variant="body1">
            Some other statistic
          </Typography>
        </Grid>
        <Grid item xs={4} sx={sx} direction="column">
          <picture>
            <img src='mosquito.svg' style={{maxHeight: '150px'}}/>
          </picture>
          <Typography color="secondary" variant="body1">
            Some third statistic
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}