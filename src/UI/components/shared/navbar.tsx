import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import NavLink from './navlink';
import { useAppSelector } from '../../state/hooks';
import { is_flag_on } from '../../utils/utils';
import UserInfo from './userInfo';
import Typography from '@mui/material/Typography';
import { useMediaQuery, useTheme } from '@mui/material';
import NavMenu from './navmenu';
import DrawerComp from './DrawerComp';
import { RolesEnum } from '../../state/state.types';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';
import LanguageSwitcher from './LanguageSwitcher';
import admin from '../../pages/admin';
import uploader from '../dataset/uploader';

export default function NavBar() {
  const t = useTranslations('MenuItems');

  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const auth = useAppSelector((state) => state.auth);
  const roles = useAppSelector((state) => state.auth.roles);
  const isAdmin = useAppSelector((state) =>
    state.auth.roles.includes(RolesEnum.ADMIN)
  );

  const moreOptions = [
    { text: t('species'), url: '/species' },
    { text: t('source'), url: '/sources' },
    { text: t('addSource'), url: '/new_source', role: 'uploader' },
    { text: t('datasets'), url: '/uploaded-dataset/list' },
    { text: t('catalogue'), url: '/speciesCatalogue' },
  ];
  if (
    user &&
    (roles.includes(RolesEnum.MODEL_MANAGER) || roles.includes(RolesEnum.ADMIN))
  ) {
    moreOptions.push({ text: t('models'), url: '/uploaded-model/list' });
    moreOptions.push({ text: t('editPointData'), url: '/editPointData' });
  }
  if (
    user &&
    (roles.includes(RolesEnum.REVIEWER_MANAGER) ||
      roles.includes(RolesEnum.REVIEWER) ||
      roles.includes(RolesEnum.ADMIN))
  ) {
    moreOptions.push({ text: t('doi'), url: '/doi' });
  }
  if (user && isAdmin) {
    moreOptions.push({ text: t('communication'), url: '/communication-log' });
    moreOptions.push({
      text: t('admin'),
      url: '/admin',
    });
    moreOptions.push({ text: t('translations'), url: '/translations-edit' });
  }

  const navItemStyle = {
    mx: 2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: 'black',
    fontWeight: 500,
  };

  const navMenuItems: React.ReactNode[] = [];

  // Admin-only: Map (also respects feature flag)

  navMenuItems.push(<NavLink key="Map" url="/map" text={t('Data')} />);

  // Admin-only: Upload
  if (user && isAdmin) {
    navMenuItems.push(<NavLink key="Upload" url="/hub" text={t('upload')} />);
  }

  // Public routes
  navMenuItems.push(<NavLink key="News" url="/news" text={t('news')} />);
  navMenuItems.push(<NavLink key="About" url="/about" text={t('about')} />);

  // More menu
  navMenuItems.push(
    <NavMenu key="More" text={t('more')} options={moreOptions} />
  );

  // Help
  navMenuItems.push(<NavLink key="Help" url="/help" text={t('help')} />);

  // Auth section
  if (user) {
    navMenuItems.push(<UserInfo key="user" user={user} />);
  } else {
    navMenuItems.push(
      <NavLink key="Login" url="/api/auth/login" text={t('login')} />
    );
  }

  // Language switcher
  navMenuItems.push(<LanguageSwitcher key="languageSwitcher" />);
  return (
    <AppBar
      id="navbar"
      position="sticky"
      sx={{ bgcolor: 'white', top: 0, margin: 0, zIndex: 2 }}
    >
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
  );
}
