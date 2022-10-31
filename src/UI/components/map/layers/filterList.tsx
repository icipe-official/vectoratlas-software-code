import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterDropDown from './filterDropDown';
import FilterToggle from './filterToggle';
import { drawerListToggle, drawerToggle } from '../../../state/mapSlice';

export const FilterList = ({
  sectionTitle,
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
      : sectionFlag === 'baseMap'
      ? state.map.map_drawer.baseMap
      : state.map.map_drawer.filters
  );

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const names = [
    'Ethiopia',
    'Kenya',
    'Chad',
    'Madagascar',
    'Somalia',
    'Democratic Republic of Congo',
    'Tanzania',
    'Gabon',
    'Uganda',
    'Burundi',
  ];

  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

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
          {sectionFlag === 'overlays' ? (
            <LayersIcon />
          ) : sectionFlag === 'baseMap' ? (
            <MapIcon />
          ) : (
            <FilterAltIcon />
          )}
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
      <Collapse
        in={openNestList}
        timeout="auto"
        unmountOnExit
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <FilterDropDown />
        <FilterToggle />
      </Collapse>
    </ListItem>
  );
};
export default FilterList;
