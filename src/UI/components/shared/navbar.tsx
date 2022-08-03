import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{bgcolor: 'white'}}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, mt: '6px' }}>
            <Link href='/'>
              <img src="vector-atlas-logo.svg" style={{maxHeight: '80px', cursor: 'pointer'}}/>
            </Link>
          </Box>
          <Typography variant="h6" component="div" color="primary" sx={{ ml: 3 }}>
            <Link href='/'>Home</Link>
          </Typography>
          <Typography variant="h6" component="div" color="primary" sx={{ ml: 3 }}>
            <Link href='/map'>Map</Link>
          </Typography>
          <Typography variant="h6" component="div" color="primary" sx={{ ml: 3 }}>
            <Link href='/about'>About</Link>
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ ml: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}