import { Box, Container } from '@mui/material';
import React from 'react';
import NewsDetails from '../../components/news/newsDetails';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const NewsArticlePage = (): JSX.Element => {
  return (
    <>
      <div>
        <main>
          {/* Phones: full width with a small gap. Larger screens: original 75% layout. */}
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              width: { xs: '100%', sm: '75%' },
              maxWidth: { xs: '100%', sm: '75%' },
              px: { xs: 1.5, sm: '10px' },
              py: { xs: 1.5, sm: '10px' },
              mx: 'auto',
              minWidth: 0,
            }}
          >
            {/* Card around the article: white, rounded, lightly outlined */}
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: { xs: '12px', sm: '16px' },
                border: '1px solid rgba(15, 23, 42, 0.1)',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
                p: { xs: 2, sm: 4 },
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <NewsDetails />
            </Box>
          </Container>
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default NewsArticlePage;
