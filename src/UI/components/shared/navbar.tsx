import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import NavLink from './navlink';
import { useAppSelector } from '../../state/hooks';
import { is_flag_on } from '../../utils/utils';

export default function NavBar() {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{bgcolor: 'white', margin: '0'}}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, mt: '6px' }}>
            <Link href='/'>
              <picture>
                <img src="vector-atlas-logo.svg" style={{maxHeight: '80px', cursor: 'pointer'}} alt="Vector Atlas logo"/>
              </picture>
            </Link>
          </Box>
          <NavLink url='/' text='Home' />
          { is_flag_on(feature_flags, "MAP") && <NavLink url='/map' text='Map' /> }
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
