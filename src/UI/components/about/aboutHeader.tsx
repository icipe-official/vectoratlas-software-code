import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AboutHeader() {
  const t = useTranslations('AboutPage');

  return (
    <Box>
      <Typography variant="body1" sx={{ paddingBottom: 3 }}>
        {t('header.paragraph1')}
      </Typography>
      <Typography variant="body1" sx={{ paddingBottom: 3 }}>
        {t('header.paragraph2')}
      </Typography>
      <Typography variant="body1" sx={{ paddingBottom: 3 }}>
        {t('header.paragraph3')}
      </Typography>
      <Typography variant="body1" sx={{ paddingBottom: 3, fontWeight: 'bold' }}>
        {t('header.paragraph4A')}:{' '}
        <Link href="https://forms.gle/yQeZezGfhdTZXUm4A" passHref>
          <a style={{ color: 'blue' }}> {t('header.youtubeLinkText')}</a>
        </Link>
        . {t('header.paragraph4B')}:{' '}
        <Link href="#" passHref>
          <a style={{ color: 'blue' }}>{'vectoratlas@icipe.org'}</a>
        </Link>
      </Typography>
    </Box>
  );
}
