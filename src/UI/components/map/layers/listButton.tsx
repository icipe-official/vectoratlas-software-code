import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const ListButton = ({ name }: { name: string }) => {
  return (
    <ListItemButton data-testid={`layerButton_${name}`} sx={{ pl: 2 }}>
      <Checkbox
        defaultChecked
        onClick={(e) => e.stopPropagation()}
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
