import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { Drawer, IconButton, List } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function DrawerComp({ navItems }: { navItems: any[] }) {
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
        <List data-testid="listitem">{navItems}</List>
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
