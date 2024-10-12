import { Container, Typography } from '@mui/material';
import UploadDataset from '../../components/dataset/uploadedDatasetForm';

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
            <Typography variant="h5" gutterBottom sx={{
              paddingLeft: '30px',
              paddingTop: '10px'
            }}>
              Upload New Dataset
            </Typography>
            <UploadDataset is_new_upload={true}/>
          </Container>
        </main>
      </div>
    </>
  );
};

export default uploadDatasetPage;
