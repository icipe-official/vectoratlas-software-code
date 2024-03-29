import React from 'react';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { filterHandler } from '../../../../state/map/mapSlice';
import { Info } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export const MultipleFilterToggle = (props: any) => {
  const filters = useAppSelector((state) => state.map.filters);

  const selectedValues = (
    filters[props.filterName].value as string[] | boolean[]
  ).map((v) => String(v));

  const dispatch = useAppDispatch();

  const options = props.filterOptionsArray;

  const mapBoolean = (v: string) => {
    if (v === 'true') {
      return true;
    }
    if (v === 'false') {
      return false;
    }
    return v;
  };
  const handleChange = (_: any, newSelection: any) => {
    dispatch(
      filterHandler({
        filterName: props.filterName,
        filterOptions:
          props.filterToggleType === 'boolean'
            ? newSelection.map(mapBoolean)
            : newSelection,
      })
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '5px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '5px',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="inherit"
          color="primary"
          fontSize={12}
          sx={{ paddingBottom: 1 }}
        >
          {props.filterTitle}
        </Typography>
        {props.hasEmpty && (
          <Tooltip
            title={`EMPTY denotes data points where the ${props.filterTitle} value is missing.`}
          >
            <Info color="primary" sx={{ fontSize: '1rem' }} />
          </Tooltip>
        )}
      </div>
      <ToggleButtonGroup
        value={selectedValues}
        onChange={handleChange}
        sx={{ margin: 0 }}
      >
        {options.map((option: any) => (
          <ToggleButton
            size="small"
            key={option.name}
            color="primary"
            value={option.name}
            sx={{
              margin: 0,
              fontSize: 10,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
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
