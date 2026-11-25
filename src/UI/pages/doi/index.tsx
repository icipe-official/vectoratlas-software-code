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
          {/* Full width on phones with a small gutter; 75% from md up */}
          <Container
            maxWidth={false}
            sx={{
              px: { xs: 0.5, sm: 1.25 },
              py: 1.25,
              maxWidth: { xs: '100%', md: '75%' },
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
