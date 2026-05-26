import { Container, Typography, Box, Button } from '@mui/material';
import { UserRolePanel } from '../components/admin/userRoles';
import AuthWrapper from '../components/shared/AuthWrapper';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';

export default function SourcesPage(): JSX.Element {
  const t = useTranslations('AdminPage');
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
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
                  {t('title')}
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
                    {t('datasets')}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
