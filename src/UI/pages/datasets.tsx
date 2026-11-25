import { Container, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';
import AuthWrapper from '../components/shared/AuthWrapper';
import ApprovalPage from '../components/admin/approval';

export default function DatasetsPage(): JSX.Element {
  return (
    <Container>
      <AuthWrapper role="admin">
        <div>
          <Typography variant="h4" color="primary" sx={{ mt: 2, mb: 2 }}>
            Datasets Approval
          </Typography>
          <ApprovalPage />
        </div>
      </AuthWrapper>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
