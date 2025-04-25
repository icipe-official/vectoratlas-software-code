import { Container, Typography } from '@mui/material';
import UploadedDatasetForm from '../../components/dataset/uploadedDatasetForm';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';

const uploadDatasetPage = () => {
  return (
    <>
      <div>
        <main>
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '75%',
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                paddingLeft: '30px',
                paddingTop: '10px',
              }}
            >
              Upload New Dataset
            </Typography>
            <AuthWrapper role={RolesEnum.UPLOADER}>
              <UploadedDatasetForm datasetId={''} />
            </AuthWrapper>
          </Container>
        </main>
      </div>
    </>
  );
};

export default uploadDatasetPage;
