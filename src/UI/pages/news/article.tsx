import { Container } from '@mui/material';
import React from 'react';
import NewsDetails from '../../components/news/newsDetails';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const NewsArticlePage = (): JSX.Element => {
  return (
    <>
      <div>
        <main>
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '75%',
            }}
          >
            <NewsDetails />
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
