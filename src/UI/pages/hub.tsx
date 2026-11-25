import { Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import DataHubPanel from '../components/datahub/dataHubPanel';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';
import { useTranslations } from 'next-intl';

function DataHub() {
  const t = useTranslations('DataHubPage');
  return (
    <div>
      <main>
        {/* Full width on phones, 75% from md up; small gutter from sm up */}
        <Container
          sx={{
            px: { xs: 0, sm: 1 },
            maxWidth: { xs: '100%', md: '75%' },
          }}
        >
          <SectionPanel title={t('title')}>
            <AuthWrapper role="">
              <DataHubPanel />
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

export default DataHub;
