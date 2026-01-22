import React from 'react';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Checkbox from '@mui/material/Checkbox';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { filterHandler } from '../../../../state/map/mapSlice';
import { Info } from '@mui/icons-material';
import { Tooltip, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const MultipleFilterToggle = (props: any) => {
  const t = useTranslations('MapPage');
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelection = event.target.checked ? [options[0].name] : [];
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

  // If there's only one option, render as checkbox
  if (options.length === 1) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: '2px',
          marginBottom: '2px',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography variant="inherit" color="primary" fontSize={16}>
            {props.filterTitle}
          </Typography>
          <Checkbox
            checked={selectedValues.includes(options[0].name)}
            onChange={handleCheckboxChange}
            size="small"
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon />}
            sx={{
              padding: '2px',
            }}
          />
        </div>
        {props.hasEmpty && (
          <Tooltip
            title={t('filterToggle.emptyTooltip', {
              filter: props.filterTitle,
            })}
          >
            <Info color="primary" sx={{ fontSize: '1rem' }} />
          </Tooltip>
        )}
      </div>
    );
  }

  // Original toggle button rendering for multiple options
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
          fontSize={16}
          sx={{ paddingBottom: 1 }}
        >
          {props.filterTitle}
        </Typography>
        {props.hasEmpty && (
          <Tooltip
            title={t('filterToggle.emptyTooltip', {
              filter: props.filterTitle,
            })}
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
        {options.map((option: any) => {
          const button = (
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
              {option.displayName}
            </ToggleButton>
          );

          // If a tooltip is provided for this specific option, wrap the button
          return option.tooltip ? (
            <Tooltip
              key={option.name}
              title={option.tooltip}
              arrow
              placement="top"
            >
              {/* div wrapper is sometimes needed for tooltips on disabled elements or custom layouts */}
              <Box sx={{ width: '100%', display: 'flex' }}>{button}</Box>
            </Tooltip>
          ) : (
            button
          );
        })}
      </ToggleButtonGroup>
    </div>
  );
};
