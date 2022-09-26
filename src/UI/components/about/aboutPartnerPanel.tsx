import React from 'react';
import { Grid, Box } from '@mui/material';

export default function AboutPartnerPanel({ id, name, homepage, imageURL }: { id: number; name: string; homepage: string; imageURL: string }) {
  return (
    <Grid data-testid={`partnerPanelContainer_${id}`} container item xl={3} lg={4} md={6} sx={{justifyContent: 'center', padding: 2 }}>
      <a data-testid={`partnerPanelLink_${id}`} href={homepage} target='_blank' rel='noreferrer'>
        <Box sx={{ cursor: 'pointer' }}>
          <picture>
            <img data-testid={`partnerPanelLogo_${id}`} src={imageURL} style={{width: '100%', maxHeight: 180}} alt={name}></img>
          </picture>
        </Box>
      </a>
    </Grid>
  );
}
