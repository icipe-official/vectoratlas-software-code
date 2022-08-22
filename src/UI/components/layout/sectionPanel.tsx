import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export default function sectionPanel({ title, children }: { title: string; children: any }) {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Typography variant='sectionTitle' color='primary'>
        {title}
        {/* Contact Us */}
      </Typography>
      <Box p='35px' sx={{ width: 1 }}>
        {children}
      </Box>
    </Paper>
  );
}
