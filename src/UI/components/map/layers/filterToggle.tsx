import React from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const FilterToggle = () => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Season</FormLabel>
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="start"
          control={<Switch color="primary" />}
          label="Start"
          labelPlacement="start"
        />
      </FormGroup>
    </FormControl>
  );
};
export default FilterToggle;
