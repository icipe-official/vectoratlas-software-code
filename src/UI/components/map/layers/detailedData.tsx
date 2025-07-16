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
import { DetailedOccurrence } from '../../../state/map/mapSlice';
import { useTranslations } from 'next-intl';

export default function DetailedData({ data }: { data: DetailedOccurrence }) {
  const t = useTranslations('MapPage');

  const season = data.bionomics?.season_given || data.bionomics?.season_calc;
  const speciesName = data.recorded_species?.species;
  const samplingMethod = data.sample?.sampling_occurrence_1;
  const reference = data.reference || {};

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
            {speciesName && (
              <Typography sx={{ fontStyle: 'italic' }}>
                Anopheles {speciesName}
              </Typography>
            )}
          </Grid>

          <Grid item>
            {season?.toLowerCase() === 'rainy' ? (
              <ThunderstormIcon sx={{ fontSize: '1.3rem' }} />
            ) : season?.toLowerCase() === 'dry' ? (
              <WbSunnyIcon sx={{ fontSize: '1.3rem' }} />
            ) : null}
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
              {t('detailedData.samplingMethod')}:
            </Typography>
            <Typography display="inline">
              {samplingMethod || 'N/A'}
            </Typography>
          </Grid>

          <Grid item>
            <Typography display="inline">
              {data.bionomics?.adult_data ? 'Adult ' : ''}
              {data.bionomics?.larval_site_data ? 'Larval' : ''}
            </Typography>
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
                  {t('detailedData.source')}:
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
                      {t('detailedData.author')}:
                    </Typography>
                    <Typography display="inline">
                      {reference.author || 'Unknown'}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      display="inline"
                      variant="inherit"
                      color="primary"
                      fontSize={12}
                    >
                      {t('detailedData.year')}:
                    </Typography>
                    <Typography display="inline">
                      {reference.year || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item>
                  <Typography>{reference.citation || 'No citation'}</Typography>
                </Grid>
              </AccordionDetails>
            </Accordion>
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
              {t('detailedData.id')}:
            </Typography>
            <Typography variant="caption" display="inline">
              {data.id}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
