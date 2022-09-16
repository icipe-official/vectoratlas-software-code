import React from 'react';
//import Paper from '@mui/material/Paper';
import { useAppSelector } from '../../../state/hooks';
import { OverlayPanel } from './overlayPanel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LayersIcon from '@mui/icons-material/Layers';

const unpackOverlays = (map_layers:any) => {
  const overlayList:any = [];
  for (let layer = 0; layer < map_layers.length ; layer++)
    if (map_layers[layer].name == 'world'){
      for (let overlay = 0; overlay < map_layers[layer].overlays.length; overlay++){
        const unpackedOverlay = {...map_layers[layer].overlays[overlay], sourceLayer: map_layers[layer].name, sourceType: map_layers[layer].sourceType} 
        overlayList.push(unpackedOverlay);
      }
    }
    else{
      overlayList.push(map_layers[layer]);
    }
  return overlayList;
};

export const OverlayList = (open:any) => {
  const layers = useAppSelector(state => state.map.map_overlays);
  const overlays = unpackOverlays(layers);
  return (
    // <List className='overlayListScroll' style={{'overflowY':'scroll', 'height':'30%'}}>
    //   {overlays.map( (overlay) => (
    //     <OverlayPanel key ={overlay.name} {...overlay}/>
    //   ))};
    // </List>
    <List>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <LayersIcon/>
          </ListItemIcon>
          <ListItemText sx={{ opacity: open ? 1 : 0 }}>Overlays</ListItemText>
        </ListItemButton>
      </ListItem>
    </List>
  );
};
export default OverlayList;
