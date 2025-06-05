import { Container } from '@mui/material';
import React from 'react';
import AuthWrapper from '../../components/shared/AuthWrapper';
import NewsEditor from '../../components/news/newsEditor';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

const NewsEditorPage = (): JSX.Element => {
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
