import { useEffect } from 'react';
import { Container } from '@mui/material';
import { AppDispatch } from '../state/store';
import { useDispatch } from 'react-redux';
import SectionPanel from '../components/layout/sectionPanel';
import dynamic from 'next/dynamic';
import { getSourceInfo } from '../state/source/actions/getSourceInfo';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';

const SourceTableNoSsr = dynamic(
  () => import('../components/sources/source_table'),
  { ssr: false }
);

export default function SourcesPage(): JSX.Element {
  const t = useTranslations('SourcesPage');
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getSourceInfo());
  }, [dispatch]);

  return (
    <div>
      <main>
        <Container
          sx={{
            // Small edge padding on phones, original 10px from sm up
            padding: { xs: '4px', sm: '10px' },
            // Full width on phones and tablets, original 75% from md up
            maxWidth: { xs: '100%', md: '75%' },
          }}
        >
          <SectionPanel title={t('title')}>
            <SourceTableNoSsr />
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
