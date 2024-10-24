import { Container } from '@mui/material';
import React from 'react';
import { UploadedDatasetDetailView } from '../../components/dataset/uploadedDatasetDetailView';
import { useRouter } from 'next/router'; 

const UploadedDatasetDetailsPage = () => {
  const router = useRouter();
  const datasetid = router.query.id as string | undefined;
  return (
    <Container>
      {/* <UploadedDatasetDetailView datasetId={datasetid} /> */}
      <UploadedDatasetDetailView />
    </Container>
  );
};

export default UploadedDatasetDetailsPage;
