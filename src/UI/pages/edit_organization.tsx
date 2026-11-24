// pages/edit_organization.tsx  (localhost:3002/edit_organization?id=...)
// Mirrors the edit_source?id=... page: own route, back link, toast on success.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { GetServerSidePropsContext } from 'next';
import AuthWrapper from '../components/shared/AuthWrapper';
import { RolesEnum } from '../state/state.types';
import { getMessages } from '../utils/localization';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import {
  LogoChange,
  Organization,
  OrganizationFields,
  applyLogoChange,
  getOrganization,
  updateOrganization,
} from '../api/organizationService';
import { useAuthToken } from '../hooks/useAuthToken';
import OrganizationForm from '../components/organization/OrganizationForm';
import Toast, {
  ToastState,
  closedToast,
} from '../components/organization/Toast';
import { brand } from '../components/organization/organizationUi';

function EditOrganizationContent() {
  const t = useTranslations('OrganizationPage');
  const router = useRouter();
  const token = useAuthToken();
  const id = typeof router.query.id === 'string' ? router.query.id : undefined;

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const [toast, setToast] = useState<ToastState>(closedToast);
  const [showBackFab, setShowBackFab] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!id) {
      setLoadError(t('notSelected'));
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const org = await getOrganization(id, token);
        if (!cancelled) setOrganization(org);
      } catch (e) {
        if (!cancelled)
          setLoadError(
            e instanceof Error
              ? e.message
              : t('organizationLoadFailed')
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router.isReady, id, token]);

  const handleSubmit = async (fields: OrganizationFields, logo: LogoChange) => {
    if (!organization) return;
    setSaving(true);
    setShowBackFab(false);
    try {
      const logoUrl = await applyLogoChange(logo, organization.logoUrl, token);
      const updated = await updateOrganization(
        organization.id,
        { ...fields, logoUrl },
        token
      );
      setOrganization(updated);
      setFormVersion((v) => v + 1); // remount the form so "unsaved changes" starts clean
      setShowBackFab(true);
      setToast({
        open: true,
        severity: 'success',
        message: t('updated', { name: updated.name }),
      });
    } catch (e) {
      setToast({
        open: true,
        severity: 'error',
        message:
          e instanceof Error
            ? e.message
            : t('updateFailed'),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: brand.green, fontWeight: 600, mb: 3 }}
      >
        {t('edit')}
      </Typography>

      {loading ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress sx={{ color: brand.green }} />
        </Box>
      ) : loadError || !organization ? (
        <Alert severity="error">
          {loadError ?? t('organizationLoadFailed')}
        </Alert>
      ) : (
        <OrganizationForm
          key={`${organization.id}-${formVersion}`}
          isEdit
          saving={saving}
          submitLabel={t("update")}
          initial={{
            name: organization.name,
            website: organization.website,
            acknowledgement: organization.acknowledgement,
            termsAndConditions: organization.termsAndConditions,
          }}
          initialLogoUrl={organization.logoUrl}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowBackFab(false);
            router.push('/organizations');
          }}
          showBackButton={showBackFab}
          onBack={() => {
            setShowBackFab(false);
            router.push('/organizations');
          }}
        />
      )}

      <Toast
        toast={toast}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </Container>
  );
}

export default function EditOrganizationPage() {
  return (
    <AuthWrapper role={RolesEnum.ADMIN}>
      <EditOrganizationContent />
    </AuthWrapper>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
