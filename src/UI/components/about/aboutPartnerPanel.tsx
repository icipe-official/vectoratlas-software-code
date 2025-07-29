import React from 'react';
import { Grid, Box, Grow, useTheme } from '@mui/material';

export default function AboutPartnerPanel({
  id,
  name,
  homepage,
  imageURL,
}: {
  id: number;
  name: string;
  homepage: string;
  imageURL: string;
}) {
  const theme = useTheme();

  return (
    <Grid
      data-testid={`partnerPanelContainer_${id}`}
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      xl={3}
      sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}
    >
      <Grow in timeout={500 + id * 100}>
        <Box
          component="a"
          data-testid={`partnerPanelLink_${id}`}
          href={homepage}
          target="_blank"
          rel="noreferrer"
          sx={{
            width: '100%',
            maxWidth: 300,
            minHeight: 200,
            backgroundColor: '#fff',
            borderRadius: 4,
            boxShadow: theme.shadows[3],
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px) scale(1.02)',
              boxShadow: theme.shadows[6],
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
          }}
        >
          <picture>
            <img
              data-testid={`partnerPanelLogo_${id}`}
              src={imageURL}
              alt={name}
              style={{
                width: '100%',
                maxHeight: 140,
                objectFit: 'contain',
              }}
            />
          </picture>
        </Box>
      </Grow>
    </Grid>
  );
}
