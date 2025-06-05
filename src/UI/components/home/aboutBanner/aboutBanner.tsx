import { Typography, Box, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AboutBanner() {
  const t = useTranslations('AboutBanner');
  return (
    <Box
      data-testid="about"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: 1,
      }}
    >
      <Link
        passHref
        //href="mailto:vectoratlas@icipe.org?subject=Joining the Vector Atlas mailing list"
        href={'mailto:vectoratlas@icipe.org?subject=' + t('emailSubject')}
      >
        <Button size="small" variant="contained" sx={{ width: '100%', ml: 0 }}>
          <Typography variant="body1">{t('joinMailingList')}</Typography>
        </Button>
      </Link>
      <Link passHref href="/about">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          sx={{ width: '100%', mr: 0 }}
        >
          <Typography variant="body1">{t('more')}</Typography>
        </Button>
      </Link>
    </Box>
  );
}
