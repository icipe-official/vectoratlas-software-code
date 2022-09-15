import React, { useRef, useEffect } from 'react';

import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LayersIcon from '@mui/icons-material/Layers';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { transform } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import XYZ from 'ol/source/XYZ';

import { useAppSelector } from '../../state/hooks';

import { pixelHoverInteraction, getPixelColorData } from './map.utils';
import {OverlayList} from './layers/overlayList';
import { Typography } from '@mui/material';

const defaultStyle = new Style({
  fill: new Fill({
    color: [0,0,0,0]
  }),
  stroke: new Stroke({
    color: 'white',
    width: 0.5
  })
});

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const MapWrapper= () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const mapStyles = useAppSelector(state => state.map.map_styles);

  const layerStyles = Object.assign({}, ...mapStyles.layers.map((layer:any) => ({[layer.name]: new Style({
    fill: new Fill({
      color: layer.fillColor
    }),
    stroke: layer.strokeColor ? new Stroke({ 
      color: layer.strokeColor,
      width: layer.strokeWidth
    }): undefined,
    zIndex: layer.zIndex
  })})));

  const mapElement =useRef(null);

  useEffect(() => {

    const an_gambiaeXYZ = new XYZ({
      url: '/data/overlays/{z}/{x}/{y}.png',
      maxZoom: 5,
    });

    // Generating Layers for Map
    const an_gambiae = new TileLayer({
      source: an_gambiaeXYZ,
      opacity: 1.0,
    });
    
    const baseMap = new VectorTileLayer({
      source: new VectorTileSource({
        attributions:
          '&copy; OpenStreetMap contributors, Who’s On First, ' +
          'Natural Earth, and osmdata.openstreetmap.de',
        format: new MVT(),
        maxZoom: 5,
        url: '/data/world/{z}/{x}/{y}.pbf',
      }),
      style: (feature) => {
        const layerName = feature.get('layer');
        return layerStyles[layerName] ?? defaultStyle;
      },
    });

    // Passing in layers to generate map with overlays 
    const initialMap = new Map({
      target: 'mapDiv',
      layers: [ baseMap , an_gambiae ],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });

    // Opacity Control Functionality:  
    const opacityInput:any = document.getElementById('opacity-input');
    const opacityOutput:any = document.getElementById('opacity-output');
    function update() {
      const opacity = parseFloat(opacityInput.value);
      an_gambiae.setOpacity(opacity);
      opacityOutput.innerText = opacity.toFixed(2);
    }
    opacityInput.addEventListener('input', update);
    update();

    // Layer Hover Information based on rgba values
    const info1:any = document.getElementById('info1');
    initialMap.on('pointermove', e => pixelHoverInteraction(e, an_gambiae, getPixelColorData, info1));

    // Initialise map
    return () => initialMap.setTarget(undefined);
  }, [layerStyles]);

  // Return fragment with map and information children 
  return (
    <Paper sx={{width:'80vw'}}>
      <Box sx={{display:'flex', alignItems:'center'}}>
        <Main id='mapDiv' ref={mapElement} style={{ position:'relative',height:'80vh', width:'10%'}} data-testid='mapDiv'>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ position: 'absolute', marginLeft:'auto',zIndex:10, mt:15,ml:2, mr: 2, ...(open && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
          <Drawer
            sx={{
              flexShrink: 0,
              '& .MuiDrawer-root': {
                position: 'absolute'
              },
              '& .MuiDrawer-paper': {
                width: 300,
                height:'50%',
                boxSizing: 'border-box',
                position:'absolute',
                margin:'30px',
                borderRadius:'5px'
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <OverlayList/>
            <Divider />
            <List>
              {['Layers', 'Settings', 'About'].map((text) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {text === 'Layers' ? <FolderIcon /> :
                        text ==='Settings' ? <SettingsIcon /> : 
                          <InfoIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
        </Main>
      </Box>
      <div style={{'display':'flex', 'justifyContent':'space-around'}}>
        <label data-testid='opacityScroll'>
          Layer opacity &nbsp;
          <input id='opacity-input'  className='slider' type='range' min='0' max='1' step='0.01' data-testid='opacity-input'/>
          <span id='opacity-output'  className='sliderDial' data-testid='opacity-output'></span>
        </label>
        <label style={{'display':'flex'}}>
          <div data-testid ='layerInteractionTitle'>Layer Interaction based on RGBA: &nbsp; </div><span id='info1' data-testid='info1'></span>
        </label>
      </div>
    </Paper>
  );
};
