import { Container } from '@mui/material';
import { DoiList } from '../../components/doi/doiList';
import { DoiRequestDetailsPage } from './details';
import AuthWrapper from '../../components/shared/AuthWrapper';

const DoiListPage = (): JSX.Element => {
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
            {/* <AuthWrapper role="admin"> */}
            <DoiList />
            {/* </AuthWrapper> */}
          </Container>
        </main>
      </div>
    </>
  );
};

export default DoiListPage;
