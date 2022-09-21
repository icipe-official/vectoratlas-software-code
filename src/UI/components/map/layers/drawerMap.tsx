import React from 'react';
import { useAppSelector } from '../../../state/hooks';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { OverlayList } from './overlayList';
import { BaseMapList } from '../layers/baseMapList';

const DrawerMap= () => {

  const unpackOverlays = (map_layers:any) => {
    const overlayList:any = [];
    const baseMapList:any = [];
    for (let layer = 0; layer < map_layers.length ; layer++)
      if (map_layers[layer].name == 'world'){
        for (let overlay = 0; overlay < map_layers[layer].overlays.length; overlay++){
          const unpackedOverlay = {...map_layers[layer].overlays[overlay], sourceLayer: map_layers[layer].name, sourceType: map_layers[layer].sourceType}; 
          baseMapList.push(unpackedOverlay);
        }
      }
      else{
        overlayList.push(map_layers[layer]);
      }
    return [overlayList, baseMapList];
  };

  const drawerWidth = 240;
  const layers = useAppSelector(state => state.map.map_overlays);
  const overlays = unpackOverlays(layers)[0];
  const baseMap = unpackOverlays(layers)[1];

  const theme = useTheme();
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
    marginTop:90
  });

  const closedMixin = (theme:any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    margin:'0px',
    marginTop:90,
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
    ({ theme, open }) => ({
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
        <IconButton onClick={handleDrawer}>
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
