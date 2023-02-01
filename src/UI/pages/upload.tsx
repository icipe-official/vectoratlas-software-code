import { Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import Upform from '../components/upload/data/Upform';
import ValdidationConsole from '../components/upload/validation/validationConsole';

function Upload() {
  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title="Data upload">
            <AuthWrapper role="uploader">
              <Upform />
            </AuthWrapper>
            <ValdidationConsole/>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default Upload;
