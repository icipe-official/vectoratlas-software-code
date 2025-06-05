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
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '75%',
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
