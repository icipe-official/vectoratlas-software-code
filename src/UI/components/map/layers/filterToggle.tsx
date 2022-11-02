import React, { JSXElementConstructor, useState } from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { activeFilterToggle } from '../../../state/mapSlice';

export const MultipleFilterToggle = (filterObject: any) => {
  const filterToggle = useAppSelector(
    (state: any) => state.map.filters[`set${filterObject.filterTitle}`]
  );
  const [options, setOptions] = useState(() => filterObject.filterOptionsArray);

  const handleFormat = (event: any, newoptions: any) => {
    setOptions(newoptions);
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
      <ToggleButtonGroup
        value={options}
        onChange={handleFormat}
        aria-label={filterObject.filterTitle + 'filter'}
        sx={{ justifyContent: 'center', width: '100%' }}
      >
        {filterObject.filterOptionsArray.map((option: any) => (
          <ToggleButton
            size="small"
            disabled={!filterToggle}
            key={option.name}
            color="primary"
            value={option.name}
            aria-label={option}
            sx={{ fontSize: 10, display: 'flex', flexDirection: 'column' }}
          >
            {option.optionIcon}
            {option.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};
export default MultipleFilterToggle;
