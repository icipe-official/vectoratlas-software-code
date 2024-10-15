import { Container } from '@mui/material';
import React from 'react';
import { UploadedDatasetDetailView } from '../../components/dataset/UploadedDatasetDetailView';
import { useRouter } from 'next/router';

const UploadedDatasetDetailsPage = () => {
  const router = useRouter();
  const datasetid = router.query.id as string | undefined;
  return (
    <Container>
      <UploadedDatasetDetailView datasetId={datasetid} />
    </Container>
  );
};

export default UploadedDatasetDetailsPage;