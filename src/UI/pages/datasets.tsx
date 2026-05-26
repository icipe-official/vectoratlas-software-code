import { Container, Typography } from '@mui/material';
import AuthWrapper from '../components/shared/AuthWrapper';
import ApprovalPage from '../components/admin/approval';

export default function DatasetsPage(): JSX.Element {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <main>
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
      </main>
    </div>
  );
}
