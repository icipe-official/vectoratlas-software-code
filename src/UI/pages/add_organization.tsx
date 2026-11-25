// pages/add_organization.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { GetServerSidePropsContext } from 'next';
import AuthWrapper from '../components/shared/AuthWrapper';
import { RolesEnum } from '../state/state.types';
import { getMessages } from '../utils/localization';
import { Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  LogoChange,
  OrganizationFields,
  applyLogoChange,
  createOrganization,
} from '../api/organizationService';
import { useAuthToken } from '../hooks/useAuthToken';
import OrganizationForm from '../components/organization/OrganizationForm';
import Toast, {
  ToastState,
  closedToast,
} from '../components/organization/Toast';
import { brand } from '../components/organization/organizationUi';

const EMPTY: OrganizationFields = {
  name: '',
  website: '',
  acknowledgement: '',
  termsAndConditions: '',
};

function AddOrganizationContent() {
  const t = useTranslations('OrganizationPage');
  const router = useRouter();
  const token = useAuthToken();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(closedToast);

  const handleSubmit = async (fields: OrganizationFields, logo: LogoChange) => {
    setSaving(true);
    try {
      const logoUrl = await applyLogoChange(logo, null, token);
      const created = await createOrganization({ ...fields, logoUrl }, token);
      router.push(`/organizations?created=${encodeURIComponent(created.name)}`);
    } catch (e) {
      setToast({
        open: true,
        severity: 'error',
        message: e instanceof Error ? e.message : t('createFailed'),
      });
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/organizations')}
        sx={{ textTransform: 'none', color: brand.green, mb: 2, ml: -1 }}
      >
        {t('back')}
      </Button>

      <Typography
        variant="h4"
        component="h1"
        sx={{ color: brand.green, fontWeight: 600, mb: 3 }}
      >
        {t('add')}
      </Typography>

      <OrganizationForm
        isEdit={false}
        saving={saving}
        submitLabel={t('create')}
        initial={EMPTY}
        initialLogoUrl={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/organizations')}
      />

      <Toast
        toast={toast}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </Container>
  );
}

export default function AddOrganizationPage() {
  return (
    <AuthWrapper role={RolesEnum.ADMIN}>
      <AddOrganizationContent />
    </AuthWrapper>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
