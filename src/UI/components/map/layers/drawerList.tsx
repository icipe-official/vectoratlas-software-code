import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import { LayerControl } from './layerControl';
import { drawerListToggle, drawerToggle } from '../../../state/map/mapSlice';

export const DrawerList = ({
  sectionTitle,
  overlays,
  sectionFlag,
}: {
  sectionTitle: string;
  overlays: Array<Object>;
  sectionFlag: string;
}) => {
  const dispatch = useDispatch();
  const open = useAppSelector((state) => state.map.map_drawer.open);
  const openNestList = useAppSelector((state) =>
    sectionFlag === 'overlays'
      ? state.map.map_drawer.overlays
      : state.map.map_drawer.baseMap
  );

  const handleClick = () => {
    if (open === true) {
      dispatch(drawerListToggle(sectionFlag));
    } else {
      dispatch(drawerToggle());
      dispatch(drawerListToggle(sectionFlag));
    }
  };

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        data-testid={`${sectionFlag}Button`}
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
          {sectionFlag === 'overlays' ? <LayersIcon /> : <MapIcon />}
        </ListItemIcon>
        <ListItemText primary={sectionTitle} sx={{ opacity: open ? 1 : 0 }} />
        {openNestList && open ? (
          <ExpandLess />
        ) : !openNestList && open ? (
          <ExpandMore />
        ) : (
          <></>
        )}
      </ListItemButton>
      <Collapse in={openNestList} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          data-testid={`${sectionFlag}ListContainer`}
        >
          {overlays.map((overlay: any) => (
            <LayerControl
              key={overlay.name}
              name={overlay.name}
              displayName={overlay.displayName}
              isVisible={overlay.isVisible}
            />
          ))}
        </List>
      </Collapse>
    </ListItem>
  );
};
export default DrawerList;
