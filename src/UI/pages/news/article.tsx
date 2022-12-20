import { Container } from '@mui/material';
import React from 'react';
import NewsDetails from '../../components/news/newsDetails';

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

export default NewsArticlePage;
