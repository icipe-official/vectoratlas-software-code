// import { AddIcon } from '@mui/icons-material/Add';
//import { Button}
import { Button, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { Link } from '@mui/icons-material';
// import { UploadedModelList } from '../../components/model/uploadedModelList';
import { UploadedModelList } from '../../components/model/uploadedModelList';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../../utils/localization';

const UploadedModelListPage = (): JSX.Element => {
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
            <AuthWrapper role={[RolesEnum.ADMIN, RolesEnum.MODEL_MANAGER]}>
              <UploadedModelList />
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

export default UploadedModelListPage;
