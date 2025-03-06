import { Container } from '@mui/material';
import React from 'react';
import { UploadedDatasetDetailView } from '../../components/dataset/uploadedDatasetDetailView';
import { useRouter } from 'next/router';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';

const UploadedDatasetDetailsPage = () => {
  const router = useRouter();
  const datasetid = router.query.id as string | undefined;
  return (
    <Container>
      <AuthWrapper
        role={[
          RolesEnum.UPLOADER,
          RolesEnum.REVIEWER,
          RolesEnum.REVIEWER_MANAGER,
          RolesEnum.ADMIN,
        ]}
      >
        <UploadedDatasetDetailView />
      </AuthWrapper>
    </Container>
  );
};

export default UploadedDatasetDetailsPage;
