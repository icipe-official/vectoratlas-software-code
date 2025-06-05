import { Container } from '@mui/material';
import { DoiList } from '../../components/doi/doiList';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../../utils/localization';

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
            <AuthWrapper role="admin">
              <DoiList />
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

export default DoiListPage;
