import { Container } from '@mui/material';
import DoiDetails from '../../components/doi/doiDetails';
import CommunicationDetails from '../../components/communicationLog/communicationLogDetails';

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
            {/* <AuthWrapper role="admin"> */}
            <CommunicationDetails />
            {/* </AuthWrapper> */}
          </Container>
        </main>
      </div>
    </>
  );
};

export default CommunicationLogDetailPage;
