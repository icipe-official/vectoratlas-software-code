import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { filterHandler } from '../../../../state/map/mapSlice';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FilterDropDown = (props: any) => {
  const dispatch = useAppDispatch();

  const filters = useAppSelector((state) => state.map.filters);
  const filterAvailableValues = useAppSelector(
    (state) => state.map.filterValues
  );

  const allValues = filterAvailableValues[props.filterName];

  const handleChange = (event: any, value) => {
    dispatch(
      filterHandler({
        filterName: props.filterName,
        filterOptions: value,
      })
    );
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
        {props.filterTitle}
      </Typography>
      <Autocomplete
        multiple
        size="small"
        onChange={handleChange}
        options={allValues}
        disableCloseOnSelect
        getOptionLabel={(option) => String(option)}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )}
        style={{ width: '100%' }}
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
};
export default FilterDropDown;
