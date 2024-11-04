import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import ReuploadDatasetForm from '../components/dataset/reuploadDatasetForm';

const ReUploadDatasetPage = () => {
  const router = useRouter();
  const datasetId = (router.query.id as string) || undefined;
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
              Re-upload Dataset
            </Typography>
            <ReuploadDatasetForm datasetId={datasetId} />
          </Container>
        </main>
      </div>
    </>
  );
};

export default ReUploadDatasetPage;
