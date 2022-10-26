import React, { useEffect } from 'react';

import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useAppDispatch } from '../../../state/hooks';

const ListButton = ({ name }: { name: string }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // 👇️ call method in useEffect hook
    var checkbox = document.getElementById(`${name}Checkbox`);
    checkbox?.addEventListener('click', function () {
      console.log(`check change ${name}`);
    });
  }, [name]);
  return (
    <ListItemButton data-testid={`layerButton_${name}`} sx={{ pl: 2 }}>
      <Checkbox
        id={`${name}Checkbox`}
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
