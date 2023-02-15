import { Container, Typography } from '@mui/material';
import { UserRolePanel } from '../components/admin/userRoles';
import AuthWrapper from '../components/shared/AuthWrapper';

export default function SourcesPage(): JSX.Element {
  return (
    <div>
      <main>
        <Container>
          <AuthWrapper role="admin">
            <div>
              <Typography
                color="primary"
                variant="h4"
                sx={{ mt: 2, mb: 1 }}
                style={{ flexGrow: 1 }}
              >
                Administration
              </Typography>
              <UserRolePanel />
            </div>
          </AuthWrapper>
        </Container>
      </main>
    </div>
  );
}
