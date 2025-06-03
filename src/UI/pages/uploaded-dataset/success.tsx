// import { AddIcon } from '@mui/icons-material/Add';
//import { Button}
import { Button, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { Link } from '@mui/icons-material';
import { UploadedDatasetList } from '../../components/dataset/uploadedDatasetList';
import AuthWrapper from '../../components/shared/AuthWrapper';
import UploadSuccess from '../../components/upload/data/uploadSuccess';
import { useAppSelector } from '../../state/hooks';
import { RolesEnum } from '../../state/state.types';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';

const UploadedDatasetSuccessPage = (): JSX.Element => {
  const uploadedDatasetId =
    useAppSelector((state) => state.upload.currentUploadedDatasetId) || '';
  const uploadedDatasetTitle =
    useAppSelector((state) => state.upload.currentUploadedDatasetTitle) || '';

  return (
    <>
      <div>
        <main style={{ textAlign: 'center' }}>
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '90%',
            }}
          >
            <AuthWrapper role={RolesEnum.UPLOADER}>
              <UploadSuccess
                id={uploadedDatasetId}
                title={uploadedDatasetTitle}
              />
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

export default UploadedDatasetSuccessPage;
