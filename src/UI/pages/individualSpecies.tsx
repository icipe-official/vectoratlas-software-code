import { Box, Container, Grid, Typography } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { getFullDetails } from '../state/speciesInformation/speciesInformationSlice';

export default function SpeciesDetails(): JSX.Element {
  const currentSpecies = useAppSelector(
    (state) => state.speciesInfo.currentInfoDetails
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFullDetails(currentSpecies));
  }, [currentSpecies, dispatch]);

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  const speciesDetails: any = useAppSelector(
    (state) => state.speciesInfo.speciesDict.items
  ).find((species) => species.id === currentSpecies);
  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: isMatch ? null : '75%',
          }}
        >
          <SectionPanel title={'Aedes Albopictus'}>
            <Box
              sx={{
                marginX: 5,
                paddingX: 5,
                paddingY: 2,
              }}
            >
              <Typography
                color="primary"
                variant="h6"
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                Details
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  padding: 5,
                  justifyContent: 'space-around',
                }}
              >
                <Box
                  sx={{
                    width: '25%',
                    padding: 5,
                  }}
                  component="img"
                  alt="Mosquito Species #1"
                  src={`data:image/jpeg;base64,${speciesDetails.speciesImage}`}
                />
                <Grid
                  container
                  direction={'column'}
                  spacing={1}
                  sx={{
                    width: '60%',
                    padding: 2,
                  }}
                >
                  <Grid container item>
                    <Typography color="primary">
                      Number of Papers: 96
                    </Typography>
                  </Grid>
                  <Grid container item>
                    <Typography color="primary">Last Paper: 1997</Typography>
                  </Grid>
                  <Grid container item>
                    <Typography color="primary">
                      Brief Description - {speciesDetails.description}
                    </Typography>
                  </Grid>
                  <Grid container item>
                    <Typography color="primary">Locations</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Typography
                color="primary"
                variant="h6"
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                Description
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  padding: 5,
                  justifyContent: 'space-around',
                }}
              >
                Enter a very long description md here
              </Box>
              <Typography
                color="primary"
                variant="h6"
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                Distribution Map
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  borderRadius: 5,
                  border: 2,
                  borderColor: 'primary.main',
                }}
                component="img"
                alt="Mosquito Distribution"
                src="/species/distributionPlaceholder.PNG"
              />
            </Box>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}
