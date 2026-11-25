import { Container } from '@mui/material';
import React from 'react';
import NewsList from '../../components/news/newsList';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const NewsPage = (): JSX.Element => {
  return (
    <>
      <div>
        <main>
          {/* Phones: full width, no extra padding. Larger screens: original 75% layout. */}
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              width: { xs: '100%', sm: '75%' },
              maxWidth: { xs: '100%', sm: '75%' },
              px: { xs: 0, sm: '10px' },
              py: { xs: 0, sm: '10px' },
              mx: 'auto',
              minWidth: 0,
            }}
          >
            <NewsList />
          </Container>
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default NewsPage;
