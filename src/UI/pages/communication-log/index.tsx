import { Container } from '@mui/material';
import { DoiList } from '../../components/doi/doiList';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { CommunicationLogList } from '../../components/communicationLog/communicationLogList';

const CommunicationLogListPage = (): JSX.Element => {
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
            <CommunicationLogList />
            {/* </AuthWrapper> */}
          </Container>
        </main>
      </div>
    </>
  );
};

export default CommunicationLogListPage;
