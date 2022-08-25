import React from 'react';
import { Grid, Box } from '@mui/material';

export default function AboutPartnerPanel({ id, name, homepage, imageURL }: { id: number; name: string; homepage: string; imageURL: string }) {
  return (
    <Grid data-testid={`partnerPanelContainer_${id}`} container item sx={{ width: 1 / 3, justifyContent: 'center' }}>
      <a data-testid={`partnerPanelLink_${id}`} href={homepage} target='_blank' rel='noreferrer'>
        <Box sx={{ cursor: 'pointer' }}>
          <img data-testid={`partnerPanelLogo_${id}`} src={imageURL} height='70' alt={name}></img>
        </Box>
      </a>
    </Grid>
  );
}
