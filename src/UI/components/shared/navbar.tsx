import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import NavLink from './navlink';
import { useAppSelector } from '../../state/hooks';
import { is_flag_on } from '../../utils/utils';
import UserInfo from './userInfo';
import Typography from '@mui/material/Typography';

export default function NavBar() {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const { user } = useUser();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' sx={{ bgcolor: 'white', margin: '0' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, mt: '6px' }}>
            <Link href='/'>
              <picture>
                <img src='vector-atlas-logo.svg' style={{ maxHeight: '80px', cursor: 'pointer' }} alt='Vector Atlas logo' />
              </picture>
            </Link>
          </Box>
          <NavLink url='/' text='Home' />
          {is_flag_on(feature_flags, 'MAP') && <NavLink url='/map' text='Map' />}
          <NavLink url='/about' text='About' />
          {!user && <NavLink url='/api/auth/login' text='Login' />}
          {user && <UserInfo user={user} />}
        </Toolbar>
      </AppBar>
      <AppBar position='static' sx={{ color: 'white', bgcolor: 'blue', margin: 0, textAlign: 'center' }}>
        
        <Typography variant="subtitle1" gutterBottom sx={{padding:1}}>
          This is an alpha version of the Vector Atlas, it is our latest code and subject to change - but we&apos;d really appeciate your feedback.
        </Typography>
      </AppBar>
    </Box>
  );
}
