import React from 'react';
import { useAppSelector } from '../../../state/hooks';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { OverlayList } from './overlayList';
import { BaseMapList } from './baseMapList';
import {unpackOverlays} from './unpackOverlays';

const DrawerMap= () => {

  const drawerWidth = 240;
  const layers = useAppSelector(state => state.map.map_overlays);
  const overlays = unpackOverlays(layers)[0];
  const baseMap = unpackOverlays(layers)[1];

  const [open, setOpen] = React.useState(false);
  const [openNestBasemapList, setOpenNestBasemapList] = React.useState(false);
  const [openNestOverlayList, setOpenNestOverlayList] = React.useState(false);

  const handleDrawer = () => {
    setOpen(!open);
    if(open === true){
      setOpenNestBasemapList(false);
      setOpenNestOverlayList(false);
    }
  };
  
  const openedMixin = (theme:any) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    margin:'0px',
    marginTop:92
  });

  const closedMixin = (theme:any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    margin:'0px',
    marginTop:92,
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }): any => ({
      width: drawerWidth,
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
    }),
  );

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton data-testid='drawerToggle' onClick={handleDrawer}>
          {open === true ? <ChevronLeftIcon /> : <MenuIcon/>}
        </IconButton>
      </DrawerHeader>
      <List>
        <Divider />
        <OverlayList open={open} setOpen={setOpen} openNestOverlayList={openNestOverlayList} setOpenNestOverlayList={setOpenNestOverlayList} sectionTitle='Overlays' overlays={overlays}/>
        <Divider />
        <BaseMapList open={open} setOpen={setOpen} openNestBasemapList={openNestBasemapList} setOpenNestBasemapList={setOpenNestBasemapList} sectionTitle='Base Map' baseMap={baseMap}/>
        <Divider/>
      </List>
    </Drawer>
  );
};
export {DrawerMap};
