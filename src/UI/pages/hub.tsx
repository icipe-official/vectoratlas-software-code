import {Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import DataHubPanel from '../components/datahub/dataHubPanel';
import dynamic from 'next/dynamic';


const DatasetTableNoSsr = dynamic(
  () => import('../components/datahub/dataset_table'),
  { ssr: false }
);

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
              <Container>
                <DataHubPanel />
                <SectionPanel title="Your Data">
                   <DatasetTableNoSsr  />
                </SectionPanel>
              </Container>
            </AuthWrapper>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default DataHub;
