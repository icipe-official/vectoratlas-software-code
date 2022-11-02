import React, { useState } from 'react';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { FormGroup, FormControlLabel, Switch, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { activeFilterToggle } from '../../../state/mapSlice';

export const FilterDropDown = (filterObject: any) => {
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

  const [countryName, setCountry] = useState([]);
  const filterToggle = useAppSelector(
    (state: any) => state.map.filters[`set${filterObject.filterTitle}`]
  );
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setCountry(typeof value === 'string' ? value.split(',') : value);
  };

  const dispatch = useAppDispatch();

  const handleToggle = (filterName: string) => {
    dispatch(activeFilterToggle(`set${filterName}`));
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
    >
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormGroup aria-label="position" row sx={{ width: '100%' }}>
          <FormControlLabel
            value={filterObject.filterTitle}
            control={
              <Switch
                color="primary"
                size="small"
                sx={{
                  '.MuiSwitch-switchBase': {
                    margin: 0,
                  },
                }}
              />
            }
            label={
              <Typography
                variant="inherit"
                color={filterToggle === true ? 'primary' : 'textSecondary'}
                fontSize={12}
              >
                {filterObject.filterTitle}
              </Typography>
            }
            labelPlacement="start"
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              m: 0,
            }}
            onChange={() => handleToggle(filterObject.filterTitle)}
          />
        </FormGroup>
      </FormControl>
      <FormControl
        sx={{
          m: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <InputLabel id="demo-multiple-checkbox-label" sx={{ fontSize: 12 }}>
          Select
        </InputLabel>
        <Select
          size="small"
          disabled={!filterToggle}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={countryName}
          onChange={handleChange}
          input={<OutlinedInput label="Select" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          sx={{ width: '100%' }}
        >
          {filterObject.filterOptionsArray.map((country: string) => (
            <MenuItem key={country} value={country}>
              <Checkbox checked={countryName.indexOf(country) > -1} />
              <ListItemText primary={country} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
export default FilterDropDown;
