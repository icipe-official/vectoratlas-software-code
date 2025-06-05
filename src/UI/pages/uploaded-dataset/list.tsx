// import { AddIcon } from '@mui/icons-material/Add';
//import { Button}
import { Button, Container, Typography } from '@mui/material';
import { UploadedDatasetList } from '../../components/dataset/uploadedDatasetList';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../../utils/localization';

const UploadedDatasetListPage = (): JSX.Element => {
  return (
    <>
      <div>
        <main>
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '90%',
            }}
          >
            <AuthWrapper
              role={[
                RolesEnum.UPLOADER,
                RolesEnum.ADMIN,
                RolesEnum.REVIEWER,
                RolesEnum.REVIEWER_MANAGER,
              ]}
            >
              <UploadedDatasetList />
            </AuthWrapper>
          </Container>
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default UploadedDatasetListPage;
