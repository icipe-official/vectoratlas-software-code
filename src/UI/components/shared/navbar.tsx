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
import { getUserInfo } from '../../state/authSlice';
import store from '../../state/store';
import { useEffect } from 'react';

export default function NavBar() {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const { user } = useUser();

  useEffect(() => {
    store.dispatch(getUserInfo(user));
  }, [])

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
    </Box>
  );
}
