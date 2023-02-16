import { Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import DataHubPanel from '../components/datahub/dataHubPanel';

function DataHub() {
  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title="Data Hub Page">
            <AuthWrapper role="">
              <DataHubPanel />
            </AuthWrapper>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default DataHub;
