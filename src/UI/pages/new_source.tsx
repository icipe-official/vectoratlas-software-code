import { Box, Container } from '@mui/material';
import React from 'react';
import AuthWrapper from '../components/shared/AuthWrapper';
import SourceForm from '../components/sources/source_form';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';

// Gap between the card and the screen edge on phones
const MOBILE_SIDE_GAP = 8;

function NewSource(): JSX.Element {
  return (
    <>
      <div>
        <main>
          {/* Phones: full width with a small gap. Larger screens: original 75% width. */}
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              width: { xs: '100%', sm: '75%' },
              maxWidth: { xs: '100%', sm: '75%' },
              px: { xs: `${MOBILE_SIDE_GAP}px`, sm: '10px' },
              py: { xs: 0, sm: '10px' },
              mx: 'auto',
              minWidth: 0,
            }}
          >
            <div>
              <AuthWrapper role="uploader">
                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    // Phones: keep the card look (border, rounded corners, shadow)
                    // and stop it from being wider than the screen
                    '& > *': {
                      boxSizing: 'border-box',
                      maxWidth: '100%',
                      width: { xs: '100%', sm: 'auto' },
                      marginLeft: { xs: 0, sm: undefined },
                      marginRight: { xs: 0, sm: undefined },
                      border: { xs: '1px solid', sm: undefined },
                      borderColor: { xs: 'divider', sm: undefined },
                      borderRadius: { xs: '12px', sm: undefined },
                      boxShadow: {
                        xs: '0 2px 12px rgba(0,0,0,0.08)',
                        sm: undefined,
                      },
                      backgroundColor: {
                        xs: 'background.paper',
                        sm: undefined,
                      },
                    },
                  }}
                >
                  <SourceForm />
                </Box>
              </AuthWrapper>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default NewSource;
