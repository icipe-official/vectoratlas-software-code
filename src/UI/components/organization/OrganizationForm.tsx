// components/organizations/OrganizationForm.tsx
// Shared by the Add and Edit pages.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ChangeEvent, FormEvent } from 'react';

import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Fab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import type {
  LogoChange,
  OrganizationFields,
} from '../../api/organizationService';

import LogoUploader from './LogoUploader';
import { brand } from './organizationUi';

// Accepts complete HTTP and HTTPS URLs.
const URL_PATTERN = /^https?:\/\/[^\s/$.?#][^\s]*$/i;

interface Props {
  initial: OrganizationFields;
  initialLogoUrl: string | null;
  isEdit: boolean;
  saving: boolean;
  submitLabel: string;
  onSubmit: (
    fields: OrganizationFields,
    logo: LogoChange
  ) => Promise<void> | void;
  onCancel: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

type Errors = Partial<Record<keyof OrganizationFields, string>>;

export default function OrganizationForm({
  initial,
  initialLogoUrl,
  isEdit,
  saving,
  submitLabel,
  onSubmit,
  onCancel,
  showBackButton = false,
  onBack,
}: Props) {
  const t = useTranslations('OrganizationPage');
  const [fields, setFields] = useState<OrganizationFields>({
    ...initial,
  });

  const [logo, setLogo] = useState<LogoChange>({
    type: 'keep',
  });

  const [errors, setErrors] = useState<Errors>({});

  // Update individual form fields.
  const set =
    (key: keyof OrganizationFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setFields((prev) => ({
        ...prev,
        [key]: value,
      }));

      if (errors[key]) {
        setErrors((prev) => ({
          ...prev,
          [key]: undefined,
        }));
      }
    };

  // Check whether the form has been modified.
  const dirty =
    logo.type !== 'keep' ||
    (Object.keys(initial) as (keyof OrganizationFields)[]).some(
      (key) => fields[key] !== initial[key]
    );

  // Validate form fields.
  const validate = (): Errors => {
    const next: Errors = {};

    const name = fields.name.trim();
    const website = fields.website.trim();

    if (!name) {
      next.name = t('enterName');
    } else if (name.length > 120) {
      next.name = t('nameLength');
    }

    if (website && !URL_PATTERN.test(website)) {
      next.website =
        t('invalidWebsite');
    }

    return next;
  };

  // Submit the form.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving) return;

    const next = validate();

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    try {
      await onSubmit(
        {
          name: fields.name.trim(),
          website: fields.website.trim(),
          acknowledgement: fields.acknowledgement.trim(),
          termsAndConditions: fields.termsAndConditions.trim(),
        },
        logo
      );
    } catch (error) {
      console.error('Failed to save organization:', error);
    }
  };

  return (
    <Paper
      component="form"
      noValidate
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        border: `1px solid ${brand.border}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: { xs: 2.5, md: 4 } }}>
        {/* Organization details */}

        <Stack spacing={3}>
          <TextField
            label={t("name")}
            required
            value={fields.name}
            onChange={set('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label={t("website")}
            placeholder="https://"
            value={fields.website}
            onChange={set('website')}
            error={Boolean(errors.website)}
            helperText={errors.website}
            fullWidth
          />
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Organization logo */}

        <LogoUploader
          name={fields.name}
          currentUrl={initialLogoUrl}
          onChange={setLogo}
        />

        <Divider sx={{ my: 4 }} />

        {/* Acknowledgement and terms */}

        <Stack spacing={3}>
          <TextField
            label={t("acknowledgement")}
            value={fields.acknowledgement}
            onChange={set('acknowledgement')}
            multiline
            minRows={3}
            fullWidth
          />

          <TextField
            label={t("terms")}
            value={fields.termsAndConditions}
            onChange={set('termsAndConditions')}
            multiline
            minRows={4}
            fullWidth
          />
        </Stack>
      </Box>

      {/* Form actions */}
      <Stack
        direction="row"
        spacing={1.5}
        justifyContent="flex-end"
        sx={{
          px: { xs: 2.5, md: 4 },
          py: 2,
          bgcolor: brand.surface,
          borderTop: `1px solid ${brand.border}`,
        }}
      >
        {isEdit && showBackButton && onBack && (
          <Fab
            aria-label="Back to organizations"
            title="Back to organizations"
            size="small"
            onClick={onBack}
            sx={{
              width: 38,
              height: 38,
              minHeight: 38,
              bgcolor: brand.green,
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0, 80, 45, 0.22)',
              '&:hover': {
                bgcolor: brand.greenDark,
                boxShadow: '0 4px 12px rgba(0, 80, 45, 0.3)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </Fab>
        )}

        <Button
          onClick={onCancel}
          disabled={saving}
          sx={{
            textTransform: 'none',
            color: brand.muted,
          }}
        >
          {t('cancel')}
        </Button>

        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={saving || (isEdit && !dirty)}
          sx={{
            textTransform: 'none',
            bgcolor: brand.green,
            '&:hover': {
              bgcolor: brand.greenDark,
            },
            px: 3,
          }}
        >
          {saving ? t('saving') : submitLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
