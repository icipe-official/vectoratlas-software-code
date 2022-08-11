import { Paper } from "@mui/material";
import Link from 'next/link';

export default function MapBox() {
  return (
    <Paper sx={{
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      cursor: 'pointer'
    }}>
      <Link href={'/map'}>
        <picture>
          <img src='map-image.png' style={{paddingTop: '5px'}} alt="placeholder"/>
        </picture>
      </Link>
    </Paper>
  );
}
