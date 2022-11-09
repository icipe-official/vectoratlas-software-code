import React, { useEffect } from 'react';

import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useAppDispatch } from '../../../state/hooks';
import { layerToggle } from '../../../state/mapSlice';

const ListButton = ({
  name,
  isVisible,
}: {
  name: string;
  isVisible: boolean;
}) => {
  const dispatch = useAppDispatch();
  const handleChange = (e: any) => {
    dispatch(layerToggle(name));
  };
  return (
    <ListItemButton data-testid={`layerButton_${name}`} sx={{ pl: 2 }}>
      <Checkbox
        id={`${name}Checkbox`}
        data-testid={`${name}Checkbox`}
        checked={isVisible}
        onChange={handleChange}
        style={{ width: 10, height: 10 }}
      />
      <ListItemText
        primary={name}
        primaryTypographyProps={{ fontSize: 12 }}
        sx={{ color: 'GrayText' }}
      />
    </ListItemButton>
  );
};
export { ListButton };
