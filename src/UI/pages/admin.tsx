import { Container, Typography } from '@mui/material';
import { UserRolePanel } from '../components/admin/userRoles';
import AuthWrapper from '../components/shared/AuthWrapper';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';

export default function SourcesPage(): JSX.Element {
  const t = useTranslations('AdminPage');
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
                {t('title')}
              </Typography>
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
