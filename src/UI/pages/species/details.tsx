import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getSpeciesInformation } from '../../state/speciesInformation/actions/upsertSpeciesInfo.action';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactMarkdown from 'react-markdown';
import SectionPanel from '../../components/layout/sectionPanel';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { getSourceInfo } from '../../state/source/actions/getSourceInfo';
import { getOccurrenceData } from '../../state/map/actions/getOccurrenceData';

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
  const sources = useAppSelector((state) => state.source.source_info);

  useEffect(() => {
    if (urlId) {
      dispatch(getSpeciesInformation(urlId));
    }
  }, [urlId, dispatch]);

  useEffect(() => {
    dispatch(getSourceInfo());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredSources = sources?.items.filter((source) => {
    const search = searchTerm.toLowerCase();
    return (
      source.article_title.toLowerCase().includes(search) ||
      source.author.toLowerCase().includes(search) ||
      source.citation.toLowerCase().includes(search)
    );
  });

  const rawCitations = speciesDetails?.citations;

  const citationIds: number[] = (() => {
    if (Array.isArray(rawCitations) && typeof rawCitations[0] === 'string') {
      return rawCitations[0]
        .split(',')
        .map((id) => parseInt(id.trim(), 10))
        .filter((n) => !isNaN(n));
    }
    return [];
  })();

  const citationDetails = citationIds
    .map((citationId: number) =>
      sources.items.find((source) => source.num_id === citationId)
    )
    .filter(Boolean);

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

  const speciesDescriptionSection = {
    padding: 5,
    justifyContent: 'space-around',
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        spacing={2}
        sx={{ width: '40%', marginLeft: 20, marginTop: 5 }}
      >
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleBack}
            sx={{ height: '100%' }}
          >
            <ArrowBackIcon sx={{ marginRight: 1 }} />
            <Typography fontSize="medium">Back to Species List</Typography>
          </Button>
        </Grid>

        <Grid item xs={6}>
          {speciesDetails?.link ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => router.push(`/map?species=${speciesDetails.link}`)}
              sx={{ height: '100%' }}
            >
              Show on Map
            </Button>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled
                sx={{ height: '100%' }}
              >
                Show on Map
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'center' }}
              >
                No species data on map
              </Typography>
            </Box>
          )}
        </Grid>
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
                <picture style={{ width: '25%' }}>
                  <img
                    style={{
                      width: '60%',
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
                    <ReactMarkdown>
                      {speciesDetails?.shortDescription}
                    </ReactMarkdown>
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
              <Box sx={speciesDescriptionSection}>
                {(() => {
                  let sections = [];
                  try {
                    sections = JSON.parse(speciesDetails?.description || '[]');
                  } catch (e) {
                    console.error(
                      'Invalid JSON in speciesDetails.description:',
                      e
                    );
                    return (
                      <Typography color="error">
                        Invalid description format
                      </Typography>
                    );
                  }

                  return Array.isArray(sections) ? (
                    sections.map((section, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: 'green', mb: 1 }}>
                          {section.title}
                        </Typography>
                        <Box sx={{ color: 'black' }}>
                          <ReactMarkdown>{section.content}</ReactMarkdown>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography color="error">
                      Description is not a valid array
                    </Typography>
                  );
                })()}
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
            <Typography
              color="primary"
              variant="h6"
              sx={speciesDetailsSectionHeader}
            >
              Citations
            </Typography>
            <Box sx={{ padding: 2 }}>
              {citationDetails && citationDetails.length > 0 ? (
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() =>
                    router.push(
                      `/sources?num_ids=${citationDetails
                        .map((c: any) => c.num_id)
                        .join(',')}`
                    )
                  }
                >
                  Here are the citations
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No citations listed for this species.
                </Typography>
              )}
            </Box>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
