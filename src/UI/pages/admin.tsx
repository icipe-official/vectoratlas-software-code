import { Container, Typography, Box, Button } from '@mui/material';
import { UserRolePanel } from '../components/admin/userRoles';
import AuthWrapper from '../components/shared/AuthWrapper';
import Link from 'next/link';

export default function SourcesPage(): JSX.Element {
  return (
    <div>
      <main>
        <Container>
          <AuthWrapper role="admin">
            <div>
              <Box
                sx={{
                  mt: 2,
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography color="primary" variant="h4">
                  Administration
                </Typography>
                <Link href="/datasets" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'darkgreen',
                      '&:hover': {
                        backgroundColor: 'green',
                      },
                    }}
                  >
                    Datasets
                  </Button>
                </Link>
              </Box>

              <UserRolePanel />
            </div>
          </AuthWrapper>
        </Container>
      </main>
    </div>
  );
}
