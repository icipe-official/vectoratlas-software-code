import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export default function sectionPanel({
  title,

  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        // Reset any inherited margin, then add a gap below the navbar on phones
        m: 0,
        mt: { xs: 2, sm: 0 },
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        // Visible outline on phones so the top edge doesn't merge into the white navbar
        border: { xs: '1px solid', sm: 'none' },
        borderColor: { xs: 'rgba(15, 23, 42, 0.14)', sm: 'transparent' },
        borderRadius: { xs: 2, sm: 0 },
        boxShadow: { xs: '0 2px 8px rgba(15, 23, 42, 0.08)', sm: 'none' },
      }}
    >
      <Typography
        variant="sectionTitle"
        color="primary"
        sx={{
          px: { xs: 2, sm: '35px' },
          pt: { xs: 2, sm: 0 },
          wordBreak: 'break-word',
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          px: { xs: 2, sm: '35px' },
          py: { xs: 1, sm: '35px' },
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
