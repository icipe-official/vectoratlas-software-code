import React from 'react';
import { Grid, Box, Paper, Typography } from '@mui/material';

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
  return (
    <Grid
      data-testid={`partnerPanelContainer_${id}`}
      container
      item
      xl={3}
      lg={4}
      md={6}
      xs={12}
      sx={{ justifyContent: 'center', p: 2 }}
    >
      <a
        href={homepage}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: 'none', width: '100%' }}
        data-testid={`partnerPanelLink_${id}`}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 3,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6,
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxHeight: 180,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <img
              data-testid={`partnerPanelLogo_${id}`}
              src={imageURL}
              alt={name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Typography
            variant="subtitle1"
            color="text.primary"
            fontWeight="bold"
            align="center"
          >
            {name}
          </Typography>
        </Paper>
      </a>
    </Grid>
  );
}
