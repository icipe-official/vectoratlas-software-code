import React, { JSXElementConstructor, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import FilterSwitch from './filterSwitch';
import { filterHandler } from '../../../state/mapSlice';

export const MultipleFilterToggle = (filterObject: any) => {
  const filterToggle = useAppSelector(
    (state: any) => state.map.set_filters[`set${filterObject.filterTitle}`]
  );

  const dispatch = useAppDispatch();

  const options = filterObject.filterOptionsArray;
  const selected = useAppSelector((state: any) =>
    state.map.filters[
      filterObject.filterToggleType === 'string'
        ? filterObject.filterTitle.toLowerCase()
        : `is${filterObject.filterTitle}`
    ].map((option: string | boolean) => {
      return String(option);
    })
  );

  const handleFormat = (event: any, newSelection: any) => {
    dispatch(
      filterHandler({
        filterName:
          filterObject.filterToggleType === 'string'
            ? filterObject.filterTitle.toLowerCase()
            : `is${filterObject.filterTitle}`,
        filterOptions:
          filterObject.filterToggleType === 'string'
            ? newSelection
            : newSelection.map((option: string | boolean) => {
                return option === 'true'
                  ? (option = true)
                  : option === 'false'
                  ? (option = false)
                  : option;
              }),
      })
    );
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
    >
      <FilterSwitch filterName={filterObject.filterTitle} />
      <ToggleButtonGroup
        value={selected}
        onChange={handleFormat}
        aria-label={filterObject.filterTitle + 'filter'}
        sx={{ justifyContent: 'center', width: '100%' }}
      >
        {options.map((option: any) => (
          <ToggleButton
            size="small"
            disabled={!filterToggle}
            key={option.name}
            color="primary"
            value={option.name}
            aria-label={option.name}
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
