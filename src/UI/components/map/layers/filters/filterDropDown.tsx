import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { filterHandler } from '../../../../state/map/mapSlice';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FilterDropDown = (props: any) => {
  const dispatch = useAppDispatch();

  const filters = useAppSelector((state) => state.map.filters);
  const filterAvailableValues = useAppSelector(
    (state) => state.map.filterValues
  ) as { [name: string]: string[] };

  const allValues = filterAvailableValues[props.filterName];
  const selectedValues = filters[props.filterName].value as string[];

  const handleChange = (event: any, value: string[]) => {
    dispatch(
      filterHandler({
        filterName: props.filterName,
        filterOptions: value,
      })
    );
  };

  const titleCase = (sentence: string) => {
    return sentence
      .split(' ')
      .map((word: string) => word[0].toUpperCase() + word.substring(1))
      .join(' ');
  };

  const { prefix, filterName, filterTitle } = props;

  // Mapping from internal species codes to display names
  const speciesDisplayMap: Record<string, string> = {
    'coluzzii_gambiae_m form': 'coluzzii',
    'gambiae_s form': 'gambiae',
    'gambiae_s form_m form': 'gambiae/coluzzii',
    // Add more mappings as needed
  };

  const formatLabel = (option: string) => {
    let displayOption = option;

    if (filterName === 'species') {
      displayOption = speciesDisplayMap[option] || option;
      return prefix
        ? prefix + displayOption.toLowerCase()
        : displayOption.toLowerCase();
    }

    if (filterName === 'country') {
      return prefix ? prefix + titleCase(option) : titleCase(option);
    }

    return prefix ? prefix + option.toLowerCase() : option.toLowerCase();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '5px',
        marginBottom: '10px',
      }}
    >
      <Typography
        variant="inherit"
        color="primary"
        fontSize={12}
        sx={{ paddingBottom: 1 }}
      >
        {filterTitle}
      </Typography>

      <Autocomplete
        multiple
        size="small"
        ChipProps={{
          style: { fontStyle: prefix ? 'italic' : 'normal' },
        }}
        onChange={handleChange}
        options={allValues}
        value={selectedValues}
        disableCloseOnSelect
        getOptionLabel={formatLabel}
        renderOption={(optProps, option, { selected }) => (
          <li {...optProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            <div style={{ fontStyle: prefix ? 'italic' : 'normal' }}>
              {formatLabel(option)}
            </div>
          </li>
        )}
        style={{ width: '100%' }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              autoCapitalize: 'none',
              style: { textTransform: 'lowercase' },
            }}
          />
        )}
      />
    </div>
  );
};

export default FilterDropDown;
