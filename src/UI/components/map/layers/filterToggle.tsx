import React, { JSXElementConstructor, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import FilterSwitch from './filterSwitch';

export const MultipleFilterToggle = (filterObject: any) => {
  const filterToggle = useAppSelector(
    (state: any) => state.map.set_filters[`set${filterObject.filterTitle}`]
  );
  const [options, setOptions] = useState(() => filterObject.filterOptionsArray);

  const handleFormat = (event: any, newoptions: any) => {
    setOptions(newoptions);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
    >
      <FilterSwitch filterName={filterObject.filterTitle} />
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
