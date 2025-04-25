import { Container } from '@mui/material';
import React from 'react';
import { UploadedModelDetailView } from '../../components/model/uploadedModelDetailView';
import { useRouter } from 'next/router';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';

const UploadedModelDetailsPage = () => {
  const router = useRouter();
  const datasetid = router.query.id as string | undefined;
  return (
    <Container>
      <AuthWrapper role={[RolesEnum.MODEL_MANAGER, RolesEnum.ADMIN]}>
        <UploadedModelDetailView />
      </AuthWrapper>
    </Container>
  );
};

export default UploadedModelDetailsPage;
