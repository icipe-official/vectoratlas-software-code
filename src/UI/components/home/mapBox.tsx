import { Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function MapBox() {
  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <Link href={'/map'}>
        <picture style={{position: 'relative', alignItems: 'flex-start', justifyContent: 'center', display: 'flex', width: '100%'}}>
          <img src='map-image.png' style={{width: '100%', objectFit: 'cover', maxHeight: 400}} alt="placeholder" />
          <Typography variant='h5' style={{position: 'absolute', textAlign: 'center', padding: 35, textShadow: '2px 2px 8px black', color: 'white'}}>
            Visit the map page to view, filter and overlay data
          </Typography>
        </picture>
      </Link>
    </Paper>
  );
}
