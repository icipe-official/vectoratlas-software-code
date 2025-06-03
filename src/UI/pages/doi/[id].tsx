import { Container } from '@mui/material';
import DoiDetails from '../../components/doi/doiDetails';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default DoiDetailPage;
