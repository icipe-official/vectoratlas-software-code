// components/organizations/LogoUploader.tsx
// Pick a logo from the laptop; it is resized automatically before it is ever uploaded.
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { LogoChange } from '../../api/organizationService';
import {
  LOGO_ACCEPTED_TYPES,
  LOGO_MAX_HEIGHT,
  LOGO_MAX_WIDTH,
  ResizedLogo,
  formatBytes,
  resizeLogo,
} from '../../utils/resizeLogo';
import LogoThumb from './LogoThumb';
import { brand } from './organizationUi';

interface Props {
  name: string;
  currentUrl: string | null;
  onChange: (change: LogoChange) => void;
}

export default function LogoUploader({ name, currentUrl, onChange }: Props) {
  const t = useTranslations('OrganizationPage');
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ResizedLogo | null>(null);
  const [removed, setRemoved] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Free the temporary preview URL when it is replaced or the component unmounts.
  useEffect(() => {
    return () => {
      if (pending) URL.revokeObjectURL(pending.previewUrl);
    };
  }, [pending]);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allows choosing the same file again
    if (!file) return;

    setError(null);
    setProcessing(true);
    try {
      const result = await resizeLogo(file);
      setPending(result);
      setRemoved(false);
      onChange({ type: 'replace', file: result.file });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t('imageProcessFailed')
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = () => {
    setPending(null);
    setRemoved(true);
    setError(null);
    onChange({ type: 'remove' });
  };

  const preview = pending ? pending.previewUrl : removed ? null : currentUrl;

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems={{ sm: 'center' }}
      >
        <LogoThumb
          src={preview}
          name={name || t('organization')}
          width={200}
          height={100}
        />

        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => inputRef.current?.click()}
              disabled={processing}
              sx={{
                textTransform: 'none',
                borderColor: brand.green,
                color: brand.green,
              }}
            >
              {preview ? t('replaceLogo') : t('chooseImage')}
            </Button>
            {preview && (
              <Button
                onClick={handleRemove}
                disabled={processing}
                sx={{ textTransform: 'none', color: brand.danger }}
              >
                {t('removeLogo')}
              </Button>
            )}
            {processing && (
              <CircularProgress size={20} sx={{ color: brand.green }} />
            )}
          </Stack>

          <Typography variant="body2" sx={{ color: brand.muted, mt: 1 }}>
            {t('logoHelp', { width: LOGO_MAX_WIDTH, height: LOGO_MAX_HEIGHT })}
          </Typography>

          {pending && (
            <Typography variant="body2" sx={{ color: brand.green, mt: 0.5 }}>
              {pending.wasResized
                ? t('resized', {
                    original: formatBytes(pending.originalBytes),
                    resized: formatBytes(pending.resizedBytes),
                    width: pending.width,
                    height: pending.height,
                  })
                : t('readyUpload', {
                    size: formatBytes(pending.resizedBytes),
                    width: pending.width,
                    height: pending.height,
                  })}
            </Typography>
          )}
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={LOGO_ACCEPTED_TYPES.join(',')}
        onChange={handleFile}
        hidden
      />
    </Box>
  );
}
