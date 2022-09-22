import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import {ListButton} from './listButton';

const OverlayList= ({open, setOpen, openNestOverlayList, setOpenNestOverlayList,
  sectionTitle, overlays}:{open:any, setOpen:any, openNestOverlayList:any, setOpenNestOverlayList:any, sectionTitle:string, overlays:any}) => {

  const handleClick = () => {
    if(open === true){
      setOpenNestOverlayList(!openNestOverlayList);
    }
    else{
      setOpen(!open)
      setOpenNestOverlayList(!openNestOverlayList);
    }
  };

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
        onClick={handleClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary={sectionTitle} sx={{ opacity: open ? 1 : 0 }} />
        {(openNestOverlayList && open) ? <ExpandLess/> : (!openNestOverlayList && open ? <ExpandMore/> : <></>)}
      </ListItemButton>
      <Collapse in={openNestOverlayList} timeout="auto" unmountOnExit>
        <List component='div' disablePadding data-testid='overlayListContainer'>
          {overlays.map((overlay:any) => (
            <ListButton key={overlay.name} name={overlay.name}/>
          ))}
        </List>
      </Collapse>
    </ListItem>
    
  );
};
export {OverlayList};
