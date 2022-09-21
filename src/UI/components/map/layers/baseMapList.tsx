import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MapIcon from '@mui/icons-material/Map';
import {ListButton} from './listButton';

const BaseMapList= ({open, setOpen, openNestBasemapList, setOpenNestBasemapList,
  sectionTitle, baseMap}:{open:any, setOpen:any, openNestBasemapList:any, setOpenNestBasemapList:any, sectionTitle:string, baseMap:any}) => {

  const overlays = baseMap;

  const handleClick = () => {
    if(open === true){
      setOpenNestBasemapList(!openNestBasemapList);
    }
    else{
      setOpen(!open);
      setOpenNestBasemapList(!openNestBasemapList);
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
          <MapIcon/>
        </ListItemIcon>
        <ListItemText primary={sectionTitle} sx={{ opacity: open ? 1 : 0 }} />
        {(openNestBasemapList && open) ? <ExpandLess/> : (!openNestBasemapList && open ? <ExpandMore/> : <></>)}
      </ListItemButton>
      <Collapse in={openNestBasemapList} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {overlays.map((overlay:any) => (
            <ListButton key={overlay.name} name={overlay.name} sourceType={overlay.sourceType}/>
          ))}
        </List>
      </Collapse>
    </ListItem>
    
  );
};
export {BaseMapList};
