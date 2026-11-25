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
import SpeciesImageViewer from '../../components/species/SpeciesImageViewer';

// Shared style for the two action buttons. Width follows the label, not the screen.
const actionButtonSx = {
  minHeight: 32,
  py: 0.25,
  px: 1.5,
  minWidth: 120,
  fontSize: '0.8rem',
  whiteSpace: 'nowrap',
  textTransform: 'none',
};

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
  const speciesDescriptionSection = {
    padding: 5,
    justifyContent: 'space-around',
  };
  return (
    <div>
      {/* Action row: buttons sit side by side at their natural width */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: 1,
          ml: { xs: 1.5, sm: 20 },
          mt: { xs: 3, sm: 5 },
        }}
      >
        {/* Outlined green, matching the "Back to Models" button */}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          sx={actionButtonSx}
        >
          <ArrowBackIcon sx={{ mr: 0.75, fontSize: 16 }} />
          Back to Species List
        </Button>

        {speciesDetails?.link ? (
          // Solid green, matching the DOWNLOAD button
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/map?species=${speciesDetails.link}`)}
            sx={actionButtonSx}
          >
            Show on Map
          </Button>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Button
              variant="contained"
              color="primary"
              disabled
              sx={actionButtonSx}
            >
              Show on Map
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              No species data on map
            </Typography>
          </Box>
        )}
      </Box>
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
                marginX: { xs: 1.5, sm: 5 },
                paddingX: { xs: 1.5, sm: 5 },
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

              {/* Phones: image above the text, full width.
                  Larger screens: image and text side by side. */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  justifyContent: { xs: 'flex-start', sm: 'space-around' },
                  gap: { xs: 2, sm: 0 },
                  py: { xs: 2, sm: 5 },
                  px: { xs: 0, sm: 5 },
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: 300 },
                    flexShrink: 0,
                  }}
                >
                  <SpeciesImageViewer
                    previewRef={speciesDetails?.previewImage}
                    downloadRef={speciesDetails?.speciesImage}
                    alt={`${speciesDetails?.name || 'Species'} image`}
                    speciesName={speciesDetails?.name}
                    thumbnailWidth="100%"
                  />
                </Box>

                <Box
                  sx={{
                    width: { xs: '100%', sm: '60%' },
                    minWidth: 0,
                    px: { xs: 0, sm: 2 },
                    py: { xs: 0, sm: 2 },
                    lineHeight: 1.6,
                    overflowWrap: 'anywhere',
                  }}
                >
                  <ReactMarkdown>
                    {speciesDetails?.shortDescription}
                  </ReactMarkdown>
                </Box>
              </Box>

              <Typography
                color="primary"
                variant="h6"
                sx={speciesDetailsSectionHeader}
              >
                Description
              </Typography>
              <Box
                sx={{
                  ...speciesDescriptionSection,
                  px: { xs: 0, sm: 5 },
                  py: { xs: 2, sm: 5 },
                }}
              >
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
                        <Box sx={{ color: 'black', overflowWrap: 'anywhere' }}>
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
