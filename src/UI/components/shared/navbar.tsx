import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import NavLink from './navlink';

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
          <NavLink url='/' text='Home' />
          <NavLink url='/map' text='Map' />
          <NavLink url='/about' text='About' />
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