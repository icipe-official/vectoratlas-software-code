import { Grid, Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function AboutOfficePanel({
  id,
  name,
  address,
  tel,
  fax,
  email,
}: {
  id: number;
  name: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
}) {
  const t = useTranslations('AboutPage');
  return (
    <Grid
      data-testid={`officeContainer_${id}`}
      container
      item
      sx={{ justifyContent: 'center' }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          rowGap: '3px',
          width: 1,
          cursor: 'pointer',
          padding: 2,
        }}
      >
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
          {name}
        </Typography>
        <Typography sx={{ fontSize: '14px' }}>
          {t('office.address')}: {address}
        </Typography>
        <Typography sx={{ fontSize: '14px' }}>
          {t('office.tel')}: {tel}
        </Typography>
        <Typography sx={{ fontSize: '14px' }}>
          {t('office.fax')}: {fax}
        </Typography>
        <Typography sx={{ fontSize: '14px' }}>
          {t('office.email')}: {email}
        </Typography>
      </Box>
    </Grid>
  );
}
