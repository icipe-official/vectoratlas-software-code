import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DrawerList } from './drawerList';
import { unpackOverlays } from '../map.utils';
import { Box } from '@mui/system';
import { drawerToggle } from '../../../state/mapSlice';

const DrawerMap= () => {

  const theme = useTheme();
  const dispatch = useDispatch();
  const drawerWidth = 240;
  const layers = useAppSelector(state => state.map.map_overlays);
  const open = useAppSelector(state => state.map.map_drawer.open);


  const overlays = unpackOverlays(layers)[0];
  const baseMap = unpackOverlays(layers)[1];

  const handleDrawer = () => {
    dispatch(drawerToggle());
  };
  
  const openedMixin = (theme:any) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    margin:'0px',
    marginTop:92,
    height:'80%',
  });

  const closedMixin = (theme:any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    margin:'0px',
    marginTop:92,
    height:'80%',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const drawerHeaderSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: open ? 'flex-end':'center',
    padding: 0,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  };

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
    <Drawer variant="permanent" open={open} data-testid='drawer'>
      <Divider/>
      <Box sx ={drawerHeaderSx}>
        <IconButton data-testid='drawerToggle' onClick={handleDrawer}>
          {open === true ? <ChevronLeftIcon data-testid='openDrawerChevron'/> : <MenuIcon/>}
        </IconButton>
      </Box>
      <List>
        <Divider/>
        <DrawerList sectionTitle='Overlays' overlays={overlays} sectionFlag='overlays'/>
        <Divider/>
        <DrawerList sectionTitle='Base Map' overlays={baseMap} sectionFlag='baseMap'/>
        <Divider/>
      </List>
    </Drawer>
  );
};
export {DrawerMap};
