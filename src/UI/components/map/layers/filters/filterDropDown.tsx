import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { filterHandler } from '../../../../state/map/mapSlice';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { fontStyle } from '@mui/system';

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
      .map((word: string) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(' ');
  };

  const prefix = props.prefix;
  const filterName = props.filterName;

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
        {props.filterTitle}
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
        getOptionLabel={(option) => {
          // prefix ? prefix + String(option) : String(option)
          return prefix
            ? prefix + titleCase(String(option))
            : titleCase(String(option));
        }}
        renderOption={(optProps, option, { selected }) => {
          return (
            <li {...optProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {filterName === 'country' && (
                <div style={{ fontStyle: prefix ? 'italic' : 'normal' }}>
                  {props.prefix
                    ? prefix + titleCase(String(option))
                    : titleCase(option)}
                </div>
              )}
              {filterName != 'country' && (
                <div style={{ fontStyle: prefix ? 'italic' : 'normal' }}>
                  {props.prefix ? prefix + String(option) : option}
                </div>
              )}
            </li>
          );
        }}
        style={{ width: '100%' }}
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
};
export default FilterDropDown;
