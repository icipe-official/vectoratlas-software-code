import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DrawerList } from './drawerList';
import { Box } from '@mui/system';
import { drawerToggle } from '../../../state/map/mapSlice';
import { FilterList } from './filters/filterList';
import { DownloadDataControl } from './downloadDataControl';

export default function DrawerMap() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const drawerWidth = 370;
  const overlays = useAppSelector((state) =>
    state.map.map_overlays.filter((l: any) => l.sourceLayer !== 'world')
  );
  const baseMap = useAppSelector((state) =>
    state.map.map_overlays.filter((l: any) => l.sourceLayer === 'world')
  );
  const open = useAppSelector((state) => state.map.map_drawer.open);

  const handleDrawer = () => {
    dispatch(drawerToggle());
  };

  const openedMixin = (theme: any) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    margin: '0px',
    height: 'calc(100vh - 230px)',
  });

  const closedMixin = (theme: any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    margin: '0px',
    height: 'calc(100vh - 230px)',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const drawerHeaderSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: open ? 'flex-end' : 'center',
    padding: 0,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  };

  const drawerSx = {
    width: drawerWidth,
    height: '100%',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  };

  return (
    <Drawer
      sx={drawerSx}
      PaperProps={{ sx: { position: 'inherit' } }}
      variant="permanent"
      open={open}
      data-testid="drawer"
    >
      <Box sx={drawerHeaderSx}>
        <IconButton data-testid="drawerToggle" onClick={handleDrawer}>
          {open === true ? (
            <ChevronLeftIcon data-testid="openDrawerChevron" />
          ) : (
            <MenuIcon />
          )}
        </IconButton>
      </Box>
      <List>
        <Divider />
        <FilterList sectionTitle="Filters" sectionFlag="filters" />
        <Divider />
        <DrawerList
          sectionTitle="Overlays"
          overlays={overlays}
          sectionFlag="overlays"
        />
        <Divider />
        <DrawerList
          sectionTitle="Base Map"
          overlays={baseMap}
          sectionFlag="baseMap"
        />
        <Divider />
        <DownloadDataControl />
      </List>
    </Drawer>
  );
}
