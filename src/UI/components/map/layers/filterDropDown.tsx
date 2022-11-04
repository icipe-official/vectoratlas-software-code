import React, { useState } from 'react';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import FilterSwitch from './filterSwitch';
import { filterHandler } from '../../../state/mapSlice';

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

  const dispatch = useAppDispatch();

  const selectedCountries = useAppSelector(
    (state: any) =>
      state.map.filters[`${filterObject.filterTitle.toLowerCase()}`]
  );

  const countryList = useAppSelector(
    (state: any) =>
      state.map.filterValues[`${filterObject.filterTitle.toLowerCase()}`]
  );

  const filterToggle = useAppSelector(
    (state: any) => state.map.set_filters[`set${filterObject.filterTitle}`]
  );
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    dispatch(
      filterHandler({
        filterName: filterObject.filterTitle.toLowerCase(),
        filterOptions: value,
      })
    );
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
    >
      <FilterSwitch filterName={filterObject.filterTitle} />
      <FormControl
        data-testid="dropDownForm"
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
          data-testid="dropDownSelect"
          size="small"
          disabled={!filterToggle}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedCountries}
          onChange={handleChange}
          input={<OutlinedInput label="Select" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          sx={{ width: '100%' }}
        >
          {countryList.map((country: string) => (
            <MenuItem
              key={country}
              value={country}
              data-testid={`${country}Item`}
            >
              <Checkbox checked={selectedCountries.includes(country)} />
              <ListItemText primary={country} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
export default FilterDropDown;
