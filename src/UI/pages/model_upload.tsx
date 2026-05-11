import { Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import ModelUpload from '../components/upload/models/modelUpload';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';

function ModelUploadPage() {
  const t = useTranslations('UploadedModelPage');
  return (
    <div style={{flex: 1, overflowY: 'auto'}}>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title={t('title')}>
            <AuthWrapper role="uploader">
              <ModelUpload />
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

export default ModelUploadPage;
