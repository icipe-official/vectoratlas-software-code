import { Avatar, Container } from '@mui/material';
import React, { useEffect } from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import DataHubPanel from '../components/datahub/dataHubPanel';
import dynamic from 'next/dynamic';
import { getDatasetMetadata } from '../state/review/actions/getDatasetMetadata';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../state/store';

const DatasetTableNoSsr = dynamic(
  () => import('../components/datahub/dataset_table'),
  { ssr: false }
);

function DataHub(datasetId: string) {
  // const dispatch = useDispatch<AppDispatch>();
  // useEffect(() => {
  //   dispatch(getDatasetMetadata(datasetId));
  // }, [dispatch]);
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
                   <DatasetTableNoSsr />
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
