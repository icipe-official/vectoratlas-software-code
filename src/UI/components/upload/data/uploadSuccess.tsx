import React from 'react';
import AboutHeader from '../../about/aboutHeader';
import { Typography } from '@mui/material';
import SectionPanel from '../../../components/layout/sectionPanel';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslations } from 'next-intl';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../../../utils/localization';

interface Props {
  id: string;
  title: string;
}

export default function UploadSuccess(props: Props) {
  const t = useTranslations('UploadDatasetSuccessPage');
  return (
    <main>
      <SectionPanel title={t('title')}>
        <CheckCircleIcon color="primary" sx={{ fontSize: 100 }} />
        <Typography variant="body1" sx={{ paddingBottom: 3 }}>
          {t('message')}
          <Link href={`/uploaded-dataset/${props.id}`} passHref>
            <a style={{ color: 'blue' }}> {t('linkTitle')}</a>
          </Link>
        </Typography>
      </SectionPanel>
    </main>
  );
}
