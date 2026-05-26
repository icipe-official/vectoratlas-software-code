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
