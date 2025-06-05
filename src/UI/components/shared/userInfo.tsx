import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import store from '../../state/store';
import { useEffect } from 'react';
import { getUserInfo } from '../../state/auth/actions/getUserInfo';
import { fetchAuth } from '../../api/api';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { useTranslations } from 'next-intl';

export default function UserInfo({ user }: { user: UserProfile | undefined }) {
  const t = useTranslations('UserInfo');
  const [userInfoAnchorEl, setUserInfoAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const userInfoOpen = Boolean(userInfoAnchorEl);
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserInfoAnchorEl(event.currentTarget);
  };
  const handleUserClose = () => {
    setUserInfoAnchorEl(null);
  };

  useEffect(() => {
    const load = async () => {
      //await getAccessToken();
    };
    store.dispatch(getUserInfo());
  }, []);

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="primary"
        aria-label="menu"
        sx={{ ml: 2 }}
        data-testid="userIcon"
        onClick={handleUserClick}
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={userInfoAnchorEl}
        open={userInfoOpen}
        onClose={handleUserClose}
        data-testid="userMenu"
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Typography sx={{ m: 2, whiteSpace: 'nowrap' }}>
          {t('hello')} {user?.nickname}!
        </Typography>
        <Link href="/user_settings">
          <MenuItem>{t('settings')}</MenuItem>
        </Link>
        <Link data-testid="logout" href="/api/auth/logout">
          <MenuItem>{t('logout')}</MenuItem>
        </Link>
      </Menu>
    </>
  );
}
