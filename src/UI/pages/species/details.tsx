import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getSpeciesInformation } from '../../state/speciesInformation/actions/upsertSpeciesInfo.action';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactMarkdown from 'react-markdown';
import SectionPanel from '../../components/layout/sectionPanel';

export default function SpeciesDetails() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const urlId = router.query.id as string | undefined;
  const speciesDetails: any = useAppSelector(
    (state) => state.speciesInfo.currentInfoDetails
  );

  const loadingSpeciesInformation = useAppSelector(
    (s) => s.speciesInfo.loading
  );

  useEffect(() => {
    if (urlId) {
      dispatch(getSpeciesInformation(urlId));
    }
  }, [urlId, dispatch]);

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  if (loadingSpeciesInformation) {
    return <div>loading</div>;
  }

  const handleBack = () => {
    router.push('/species');
  };

  const speciesDetailsSectionHeader = {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    padding: 2,
  };
  const speciesDetailsSection = {
    display: 'flex',
    padding: 5,
    justifyContent: 'space-around',
  };

  return (
    <div>
      <Grid
        direction={'row'}
        container
        sx={{ width: '20%', marginLeft: 20, marginTop: 5 }}
      >
        <Button onClick={handleBack} sx={{ width: '50%' }}>
          <Grid xs={2}>
            <ArrowBackIcon />
          </Grid>
          <Grid xs={8}>
            <Typography fontSize={'medium'}>Back to Species List</Typography>
          </Grid>
        </Button>
      </Grid>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: isMatch ? null : '75%',
          }}
        >
          <SectionPanel title={`${speciesDetails?.name}`}>
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
                sx={speciesDetailsSectionHeader}
              >
                Details
              </Typography>
              <Box sx={speciesDetailsSection}>
                <picture>
                  <img
                    style={{
                      width: '25%',
                      padding: 5,
                    }}
                    alt="Mosquito Species #1"
                    src={speciesDetails?.speciesImage}
                  />
                </picture>
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
                    <Typography>{speciesDetails?.shortDescription}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Typography
                color="primary"
                variant="h6"
                sx={speciesDetailsSectionHeader}
              >
                Description
              </Typography>
              <Box sx={speciesDetailsSection}>
                <ReactMarkdown>{speciesDetails?.description}</ReactMarkdown>
              </Box>
              <Typography
                color="primary"
                variant="h6"
                sx={speciesDetailsSectionHeader}
              >
                Distribution Map
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  borderRadius: 5,
                  border: 2,
                  marginTop: 2,
                  borderColor: 'black',
                  '&:hover': {
                    cursor: 'pointer',
                  },
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
