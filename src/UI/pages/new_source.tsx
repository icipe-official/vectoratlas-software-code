import { Container } from '@mui/material';
import React from 'react';
import AuthWrapper from '../components/shared/AuthWrapper';
import SourceForm from '../components/sources/source_form';

function NewSource(): JSX.Element {
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

export default NewSource;
