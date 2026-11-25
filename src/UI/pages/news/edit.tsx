import { Box, Button, Container } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import AuthWrapper from '../../components/shared/AuthWrapper';
import NewsEditor from '../../components/news/newsEditor';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const NewsEditorPage = (): JSX.Element => {
  const router = useRouter();

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
            <Box sx={{ mt: 0.75, mb: 2 }}>
              {/* Returns to the News list */}
              <Button variant="outlined" onClick={() => router.push('/news')}>
                Back to News
              </Button>
            </Box>
            <div>
              <AuthWrapper role="editor">
                <NewsEditor />
              </AuthWrapper>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default NewsEditorPage;
