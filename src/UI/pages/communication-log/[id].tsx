import { Container } from '@mui/material';
import DoiDetails from '../../components/doi/doiDetails';
import CommunicationDetails from '../../components/communicationLog/communicationLogDetails';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../../utils/localization';

const CommunicationLogDetailPage = (): JSX.Element => {
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
              <CommunicationDetails />
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

export default CommunicationLogDetailPage;
