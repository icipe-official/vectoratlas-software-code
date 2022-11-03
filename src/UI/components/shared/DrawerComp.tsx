import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

import UserInfo from './userInfo';

function DrawerComp() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const { user } = useUser();
  return (
    <div>
      <Drawer
        data-testid="drawercomponent"
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            height: 240,
          },
        }}
      >
        <List data-testid="listitem">
          <ListItemButton>
            <ListItemIcon>
              <ListItemText>
                <Link href="/">Home</Link>
              </ListItemText>
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ListItemText>
                <Link href="/map">Map</Link>
              </ListItemText>
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ListItemText>
                <Link href="/about">About</Link>
              </ListItemText>
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ListItemText>
                {!user && <Link href="/api/auth/login">Login</Link>}
                {user && <UserInfo user={user} />}
              </ListItemText>
            </ListItemIcon>
          </ListItemButton>
        </List>
      </Drawer>
      <IconButton
        sx={{ color: 'black', marginLeft: 'auto' }}
        onClick={() => setOpenDrawer(!openDrawer)}
        data-testid="openDrawer"
      >
        <MenuIcon />
      </IconButton>
    </div>
  );
}

export default DrawerComp;
