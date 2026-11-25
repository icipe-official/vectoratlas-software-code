import { Container, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import AuthWrapper from '../components/shared/AuthWrapper';
import SourceForm, { NewSource } from '../components/sources/source_form';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { AppDispatch } from '../state/store';
import { useAppSelector } from '../state/hooks';
import { getSourceById } from '../state/source/actions/getSourceById';
import { clearSourceEdit } from '../state/source/sourceSlice';

function EditSource(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations('NewSourcePage');

  const idParam = router.query.id as string | undefined;

  useEffect(() => {
    if (idParam) {
      const num_id = parseInt(idParam, 10);
      if (!isNaN(num_id)) {
        dispatch(getSourceById(num_id));
      }
    }
  }, [idParam, dispatch]);

  const source_edit = useAppSelector((state) => state.source.source_edit);
  const source_edit_status = useAppSelector(
    (state) => state.source.source_edit_status
  );

  useEffect(() => {
    if (idParam) {
      const num_id = parseInt(idParam, 10);
      if (!isNaN(num_id)) {
        dispatch(getSourceById(num_id));
      }
    }

    // Clear the previous record when leaving, so the next edit starts empty
    return () => {
      dispatch(clearSourceEdit());
    };
  }, [idParam, dispatch]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/sources');
    }
  };

  return (
    <>
      <div>
        <main>
          <Container
            maxWidth={false}
            sx={{
              // Small edge padding on phones, original 10px from sm up
              padding: { xs: '4px', sm: '10px' },
              // Full width on phones and tablets, original 75% from md up
              maxWidth: { xs: '100%', md: '75%' },
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Button
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                variant="text"
              >
                {t('buttons.back')}
              </Button>
            </Box>
            <div>
              <AuthWrapper role={['uploader', 'editor', 'admin']}>
                {source_edit_status === 'success' && source_edit ? (
                  <SourceForm existingSource={source_edit as NewSource} />
                ) : source_edit_status === 'error' ? (
                  <div>
                    <p></p>Could not load this source. It may have been deleted,
                    or the link is invalid.
                  </div>
                ) : (
                  <div>Loading....</div>
                )}
              </AuthWrapper>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default EditSource;
