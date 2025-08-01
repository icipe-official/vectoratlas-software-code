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
      xs={12}
      sm={6}
      md={4}
      lg={3}
      sx={{ justifyContent: 'center', px: 2, py: 3 }}
    >
      <Box
        sx={{
          width: '100%',
          p: 3,
          borderRadius: 2,
          background: 'white',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t('fieldStation.tel')}: <strong>{tel}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t('fieldStation.fax')}: <strong>{fax}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t('fieldStation.location')}:
          <Link href={physicalLoc} passHref legacyBehavior>
            <a
              data-testid={`fieldStationLocation_Link_${id}`}
              target="_blank"
              rel="noreferrer"
              style={{
                marginLeft: '6px',
                color: '#1976d2',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              {t('fieldStation.seeLocation')}
            </a>
          </Link>
        </Typography>
      </Box>
    </Grid>
  );
}
