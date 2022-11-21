import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function DetailedData({ data }) {
  const season = data.bionomics?.season_given
    ? data.bionomics?.season_given
    : data.bionomics?.season_calc;
  return (
    <Box>
      <Grid
        container
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        p="6px"
      >
        <Grid container direction="row" justifyContent="space-between">
          <Grid item>
            <Typography>
              {data.recorded_species.species.series} -{' '}
              {data.recorded_species.species.species}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              {data.month_start}/{data.year_start}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item>
            <Typography
              display="inline"
              variant="inherit"
              color="primary"
              fontSize={12}
            >
              TOTAL COUNT:{' '}
            </Typography>
            <Typography display="inline"> {data.sample.n_all}</Typography>
          </Grid>
          <Grid item>
            <Typography display="inline">
              {data.bionomics?.adult_data ? 'Adult' : null}
              {data.bionomics?.larval_site_data ? 'Larval' : null}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item>
            <Typography
              display="inline"
              variant="inherit"
              color="primary"
              fontSize={12}
            >
              SAMPLING METHOD:{' '}
            </Typography>
            <Typography display="inline">
              {data.sample.mossamp_tech_1}
            </Typography>
          </Grid>
          <Grid item>
            {season === 'rainy' ? (
              <ThunderstormIcon sx={{ fontSize: '1.3rem' }} />
            ) : season === 'dry' ? (
              <WbSunnyIcon sx={{ fontSize: '1.3rem' }} />
            ) : null}
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item xs={12}>
            <Accordion
              disableGutters
              sx={{ margin: 0, padding: 0, boxShadow: 'none' }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  margin: 0,
                  padding: 0,
                  minHeight: 0,
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                  },
                }}
              >
                <Typography
                  display="inline"
                  variant="inherit"
                  color="primary"
                  fontSize={12}
                >
                  SOURCE
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="row" justifyContent="space-between">
                  <Grid item>
                    <Typography
                      display="inline"
                      variant="inherit"
                      color="primary"
                      fontSize={12}
                    >
                      AUTHOR:
                    </Typography>
                    <Typography display="inline">
                      {' '}
                      {data.reference.author}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      display="inline"
                      variant="inherit"
                      color="primary"
                      fontSize={12}
                    >
                      YEAR:
                    </Typography>
                    <Typography display="inline">
                      {' '}
                      {data.reference.year}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography>{data.reference.citation}</Typography>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
