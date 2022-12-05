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

  const moreOptions = [
    { text: 'Species List', url: '/species' },
    { text: 'Source List', url: '/sources' },
    { text: 'Add Source', url: '/new_source', role: 'uploader' },
  ];

  const navMenuItems = [];
  navMenuItems.push(<NavLink url="/" text="Home" />);
  if (is_flag_on(feature_flags, 'MAP'))
    navMenuItems.push(<NavLink url="/map" text="Map" />);
  navMenuItems.push(<NavLink url="/about" text="About" />);
  navMenuItems.push(<NavMenu text="More" options={moreOptions} />);
  if (user) navMenuItems.push(<UserInfo user={user} />);
  else navMenuItems.push(<NavLink url="/api/auth/login" text="Login" />);

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
      <AppBar
        position="static"
        sx={{ color: 'white', bgcolor: 'blue', margin: 0, textAlign: 'center' }}
      >
        <Typography variant="subtitle1" gutterBottom sx={{ padding: 1 }}>
          This is an alpha version of the Vector Atlas, it is our latest code
          and subject to change - but we&apos;d really appeciate your feedback,
          our survey is{' '}
          <Link href="https://forms.gle/yQeZezGfhdTZXUm4A" passHref>
            <a>{'HERE'}</a>
          </Link>
          .
        </Typography>
      </AppBar>
    </Box>
  );
}
