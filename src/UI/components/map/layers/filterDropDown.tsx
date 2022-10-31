import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export const FilterDropDown = () => {
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

  return (
    <FormControl
      sx={{ m: 2, width: '85%', display: 'flex', flexDirection: 'column' }}
    >
      <InputLabel id="demo-multiple-checkbox-label" sx={{ fontSize: 12 }}>
        Countries
      </InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={personName}
        onChange={handleChange}
        input={<OutlinedInput label="Countries" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {names.map((name) => (
          <MenuItem
            key={name}
            value={name}
            sx={{
              '& .MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters': {
                width: '300px',
              },
            }}
          >
            <Checkbox checked={personName.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default FilterDropDown;
