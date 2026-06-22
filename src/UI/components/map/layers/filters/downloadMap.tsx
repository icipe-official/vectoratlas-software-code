import { Button, Link } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

export function DownloadMap() {
  const t = useTranslations('MapPage');

  return (
    <>
      <Button
        id="export-png-draw"
        variant="contained"
        size="medium"
        style={{ width: '100%', margin: 0 }}
      >
        {t('downloadData.downloadMapImage')}
      </Button>
      <Link id="image-download" download="map.png"></Link>
    </>
  );
}
export default DownloadMap;
