import { Container, Typography } from '@mui/material';
import UploadedDatasetForm from '../../components/dataset/uploadedDatasetForm';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';
import { useTranslations } from 'next-intl';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../../utils/localization';

const UploadDatasetPage = () => {
  const t = useTranslations('UploadedDatasetPage');
  return (
    <>
      <div>
        <main>
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '75%',
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                paddingLeft: '30px',
                paddingTop: '10px',
              }}
            >
              {t('title')}
            </Typography>
            <AuthWrapper role={RolesEnum.UPLOADER}>
              <UploadedDatasetForm datasetId={''} />
            </AuthWrapper>
          </Container>
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default UploadDatasetPage;
