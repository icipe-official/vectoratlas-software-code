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

const UploadedDatasetSuccessPage = (): JSX.Element => {
  const uploadedDatasetId =
    useAppSelector((state) => state.upload.currentUploadedDatasetId) ||
    '0172532f-88da-4a45-bba0-b0c3fc9df567';
  const uploadedDatasetTitle =
    useAppSelector((state) => state.upload.currentUploadedDatasetTitle) ||
    'Pointers Data';

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

export default UploadedDatasetSuccessPage;
