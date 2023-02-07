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
import { useMediaQuery, useTheme } from '@mui/material';
import NavMenu from './navmenu';
import DrawerComp from './DrawerComp';

export default function NavBar() {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isAdmin = useAppSelector((state) =>
    state.auth.roles.includes('admin')
  );

  const moreOptions = [
    { text: 'Species List', url: '/species' },
    { text: 'Source List', url: '/sources' },
    { text: 'Add Source', url: '/new_source', role: 'uploader' },
  ];
  if (user && isAdmin) {
    moreOptions.push({
      text: 'Admin', url: '/admin'
    })
  }

  const navMenuItems = [];
  navMenuItems.push(<NavLink key="Help" url="/help" text="Help" />);
  if (is_flag_on(feature_flags, 'MAP'))
    navMenuItems.push(<NavLink key="Map" url="/map" text="Map" />);
  navMenuItems.push(<NavLink key="Data" url="/dataHub" text="Data" />);
  navMenuItems.push(<NavLink key="About" url="/about" text="About" />);
  navMenuItems.push(<NavLink key="News" url="/news" text="News" />);
  navMenuItems.push(<NavMenu key="More" text="More" options={moreOptions} />);
  if (user) navMenuItems.push(<UserInfo key="user" user={user} />);
  else
    navMenuItems.push(
      <NavLink key="Login" url="/api/auth/login" text="Login" />
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'white', margin: '0' }}>
        <Toolbar>
          <>
            <Box sx={{ flexGrow: 1, mt: '6px' }}>
              <Link href="/">
                <picture>
                  <img
                    src="/vector-atlas-logo.svg"
                    style={{ maxHeight: '80px', cursor: 'pointer' }}
                    alt="Vector Atlas logo"
                  />
                </picture>
              </Link>
            </Box>

            {isMobile ? (
              <DrawerComp navItems={navMenuItems} />
            ) : (
              <>{navMenuItems}</>
            )}
          </>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
