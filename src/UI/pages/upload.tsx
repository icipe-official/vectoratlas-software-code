import { Button, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import Upform from '../components/upload/data/Upform';
import ValdidationConsole from '../components/upload/validation/validationConsole';
import UploadWizardForm from '../components/upload/data/UploadWizardForm';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../state/store';
import {
  setCurrentUploadedDatasetId,
  setCurrentUploadedDatasetTitle,
} from '../state/upload/uploadSlice';
import { RolesEnum } from '../state/state.types';
import { useTranslations } from 'next-intl';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';

function Upload() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // const t = useTranslations('UploadedDatasetPage');
  const t = useTranslations('UploadWizardPage');

  useEffect(() => {
    dispatch(setCurrentUploadedDatasetId(undefined));
    dispatch(setCurrentUploadedDatasetTitle(undefined));
  }, [dispatch]);

  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title={t('title') || 'Data upload'}>
            <AuthWrapper role={RolesEnum.UPLOADER}>
              <>
                {/* <Upform /> */}
                <UploadWizardForm />
              </>
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

export default Upload;
