import { Grid, Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function AboutOfficePanel({ id, name, tel, fax, physicalLoc }: { id: number; name: string; tel: string; fax: string; physicalLoc: string }) {
  return (
    <Grid data-testid={`fieldStationContainer_${id}`} container item sx={{ justifyContent: 'center' }}>
      <Box sx={{ display: 'inline-flex', flexDirection: 'column', rowGap: '3px', width: 1, cursor: 'pointer', padding: 2 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>{name}</Typography>
        <Typography sx={{ fontSize: '14px' }}>Tel: {tel}</Typography>
        <Typography sx={{ fontSize: '14px' }}>Fax: {fax}</Typography>
        <Typography sx={{ fontSize: '14px' }}>
          Location:
          <Link href={physicalLoc} passHref>
            <a data-testid={`fieldStationLocation_Link_${id}`} target='_blank' rel='noreferrer' style={{ color: 'blue' }}>
              &nbsp; See Location
            </a>
          </Link>
        </Typography>
      </Box>
    </Grid>
  );
}
