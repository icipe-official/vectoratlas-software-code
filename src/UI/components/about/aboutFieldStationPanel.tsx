import { Grid, Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AboutOfficePanel({
  id,
  name,
  tel,
  fax,
  physicalLoc,
}: {
  id: number;
  name: string;
  tel: string;
  fax: string;
  physicalLoc: string;
}) {
  const t = useTranslations('AboutPage');
  return (
    <Grid
      data-testid={`fieldStationContainer_${id}`}
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
          {t('fieldStation.tel')}: {tel}
        </Typography>
        <Typography sx={{ fontSize: '14px' }}>
          {t('fieldStation.fax')}: {fax}
        </Typography>
        <Typography sx={{ fontSize: '14px' }}>
          {t('fieldStation.location')}
          <Link href={physicalLoc} passHref>
            <a
              data-testid={`fieldStationLocation_Link_${id}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'blue' }}
            >
              &nbsp; {t('fieldStation.seeLocation')}
            </a>
          </Link>
        </Typography>
      </Box>
    </Grid>
  );
}
