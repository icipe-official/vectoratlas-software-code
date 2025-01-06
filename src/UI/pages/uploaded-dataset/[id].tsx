import { Container } from '@mui/material';
import React from 'react';
import { UploadedDatasetDetailView } from '../../components/dataset/uploadedDatasetDetailView';
import { useRouter } from 'next/router';
import AuthWrapper from '../../components/shared/AuthWrapper';

const UploadedDatasetDetailsPage = () => {
  const router = useRouter();
  const datasetid = router.query.id as string | undefined;
  return (
    <Container>
      <AuthWrapper role="admin">
        <UploadedDatasetDetailView />
      </AuthWrapper>
    </Container>
  );
};

export default UploadedDatasetDetailsPage;
