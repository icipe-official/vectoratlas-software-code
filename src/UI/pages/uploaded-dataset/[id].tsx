import { Container } from '@mui/material';
import React from 'react';
import { UploadedDatasetDetailView } from '../../components/dataset/uploadedDatasetDetailView';
import { useRouter } from 'next/router';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default UploadedDatasetDetailsPage;
