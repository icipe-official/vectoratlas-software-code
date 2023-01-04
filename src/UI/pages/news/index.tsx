import { Container } from '@mui/material';
import React from 'react';
import NewsList from '../../components/news/newsList';

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

export default NewsPage;
