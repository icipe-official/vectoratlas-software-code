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
    <div style={{flex: 1, overflowY: 'auto'}}>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
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
