import { Container } from '@mui/material';
import DoiDetails from '../../components/doi/doiDetails';
import AuthWrapper from '../../components/shared/AuthWrapper';

const DoiDetailPage = (): JSX.Element => {
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
            <AuthWrapper role="admin">
            <DoiDetails />
            </AuthWrapper>
          </Container>
        </main>
      </div>
    </>
  );
};

export default DoiDetailPage;
