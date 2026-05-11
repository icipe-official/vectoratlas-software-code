import { Container } from '@mui/material';
import React from 'react';
import AuthWrapper from '../components/shared/AuthWrapper';
import SourceForm from '../components/sources/source_form';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';

function NewSource(): JSX.Element {
  return (
    <>
      <div style={{flex: 1, overflowY: 'auto'}}>
        <main>
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '75%',
            }}
          >
            <div>
              <AuthWrapper role="uploader">
                <SourceForm />
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
