import { Container } from '@mui/material';
import React, { useState } from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import TranslationForm from '../components/translations/translation-form';
import LabelsEn from '../public/messages/en.json';

function TranslationsEditPage() {
  const t = useTranslations('TranslationsPage');

  const [labels] = useState(LabelsEn || {});

  return (
    <div>
      <main>
        <Container
          sx={{
            // Phones: use the full width with small side padding
            // Medium screens and up: keep the original 75% width
            padding: { xs: '0 12px 8px', sm: '10px' },
            maxWidth: { xs: '100%', md: '75%' },
          }}
        >
          <SectionPanel title={t('title')}>
            <AuthWrapper role="admin">
              <TranslationForm labels={labels} />
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

export default TranslationsEditPage;
