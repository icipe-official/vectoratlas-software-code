import React, { JSXElementConstructor, useState } from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography } from '@mui/material';

export const MultipleFilterToggle = (filterObject: any) => {
  const [filterToggle, setFilterToggle] = useState(false);
  const [formats, setFormats] = useState(() => filterObject.filterOptionsArray);

  const handleFormat = (event: any, newFormats: any) => {
    setFormats(newFormats);
  };

  const handleToggle = () => {
    setFilterToggle(!filterToggle);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormGroup aria-label="position" row sx={{ width: '100%' }}>
          <FormControlLabel
            value={filterObject.filterTitle}
            control={<Switch color="primary" size="small" sx={{ margin: 0 }} />}
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
            onChange={handleToggle}
          />
        </FormGroup>
      </FormControl>
      <ToggleButtonGroup
        value={formats}
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
