import { Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import UserSettingForm from '../components/settings/UserSettingForm';
import AuthWrapper from '../components/shared/AuthWrapper';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';

function UserSettings() {
  const t = useTranslations('UserSettings');
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title={t('title')}>
            <AuthWrapper role="">
              <UserSettingForm />
            </AuthWrapper>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default UserSettings;
