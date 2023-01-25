import { Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import ModelUpload from '../components/upload/models/modelUpload';

function ModelUploadPage() {
  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title="Model upload">
            <AuthWrapper role="uploader">
              <ModelUpload />
            </AuthWrapper>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default ModelUploadPage;
