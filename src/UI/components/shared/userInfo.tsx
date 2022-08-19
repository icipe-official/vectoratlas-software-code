import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserProfile } from '@auth0/nextjs-auth0';
import Link from 'next/link';

export default function UserInfo({user}: {user: UserProfile | undefined }) {

  const [userInfoAnchorEl, setUserInfoAnchorEl] = React.useState<null | HTMLElement>(null);
  const userInfoOpen = Boolean(userInfoAnchorEl);
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserInfoAnchorEl(event.currentTarget);
  };
  const handleUserClose = () => {
    setUserInfoAnchorEl(null);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      console.log(1)
      await fetch('/api/getAuth');
    };
    fetchData();
  }, [])

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="primary"
        aria-label="menu"
        sx={{ ml: 2 }}
        data-testid='userIcon'
        onClick={handleUserClick}
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={userInfoAnchorEl}
        open={userInfoOpen}
        onClose={handleUserClose}
        data-testid='userMenu'
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Typography sx={{ m: 2, whiteSpace: 'nowrap'}}>Hello {user?.nickname}!</Typography>
        <Link data-testid='logout' href='/api/auth/logout'><MenuItem>Logout</MenuItem></Link>
      </Menu>
    </>
  );
}
