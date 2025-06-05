import { Container } from '@mui/material';
import React from 'react';
import { UploadedModelDetailView } from '../../components/model/uploadedModelDetailView';
import { useRouter } from 'next/router';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default UploadedModelDetailsPage;
