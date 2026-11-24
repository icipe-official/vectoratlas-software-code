import { Alert, AlertTitle } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslations } from 'next-intl';

/**
 * Reusable maintenance notice banner built on the MUI Alert component.
 *
 * Drop this anywhere users interact with a feature that may need to be taken
 * offline for maintenance. The banner reads its text from the
 * `MapPage.downloadData.maintenanceNotice.*` translation keys by default, but
 * both the title and message can be overridden via props for other features.
 *
 * @example
 * // Show the default (data-download) maintenance notice
 * <MaintenanceNotice />
 *
 * @example
 * // Toggle it on only while a feature is under maintenance
 * <MaintenanceNotice show={isDownloadFeatureDown} />
 *
 * @example
 * // Custom text for a different feature
 * <MaintenanceNotice
 *   title="Unavailable"
 *   message="Species search is temporarily disabled for maintenance."
 * />
 */
export interface MaintenanceNoticeProps {
  /** Toggle the banner on/off. Set to `true` when entering maintenance mode. */
  show?: boolean;
  /**
   * Override the alert title. Defaults to the
   * `downloadData.maintenanceNotice.title` translation.
   */
  title?: string;
  /**
   * Override the alert body text. Defaults to the
   * `downloadData.maintenanceNotice.message` translation.
   */
  message?: string;
  /** MUI Alert severity. Defaults to `'warning'`. */
  severity?: 'error' | 'warning' | 'info' | 'success';
  /** Extra `sx` styles forwarded to the underlying Alert. */
  sx?: SxProps<Theme>;
}

export const MaintenanceNotice = ({
  show = true,
  title,
  message,
  severity = 'warning',
  sx,
}: MaintenanceNoticeProps) => {
  const t = useTranslations('MapPage');

  if (!show) return null;

  return (
    <Alert severity={severity} sx={{ mb: 2, ...sx }}>
      <AlertTitle>
        {title ?? t('downloadData.maintenanceNotice.title')}
      </AlertTitle>
      {message ?? t('downloadData.maintenanceNotice.message')}
    </Alert>
  );
};
