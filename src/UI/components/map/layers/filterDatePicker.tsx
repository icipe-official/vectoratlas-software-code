import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import Box from '@mui/material/Box';
import HeightIcon from '@mui/icons-material/Height';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import FilterSwitch from './filterSwitch';
import { filterHandler } from '../../../state/mapSlice';

export default function ViewsDatePicker(filterObject: any) {
  const filterToggle = useAppSelector(
    (state: any) => state.map.set_filters[`set${filterObject.filterTitle}`]
  );
  const valueFrom = useAppSelector(
    (state: any) => state.map.filters['startTimestamp']
  );
  const valueTo = useAppSelector(
    (state: any) => state.map.filters['endTimestamp']
  );

  const dispatch = useAppDispatch();

  const handleChange = (event: any, timeSelect: string) => {
    if (timeSelect === 'from') {
      dispatch(
        filterHandler({
          filterName: 'startTimestamp',
          filterOptions: event.getTime(),
        })
      );
    } else {
      dispatch(
        filterHandler({
          filterName: 'endTimestamp',
          filterOptions: event.getTime(),
        })
      );
    }
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
    >
      <FilterSwitch filterName={filterObject.filterTitle} />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box mt={2} aria-label="datePickerFromBox">
          <DatePicker
            data-testid="datePickerFrom"
            disabled={!filterToggle}
            inputFormat="MMM-yyyy"
            views={['month', 'year']}
            label="From"
            minDate={new Date('1980-01-01')}
            maxDate={new Date()}
            value={valueFrom}
            onChange={(e) => handleChange(e, 'from')}
            renderInput={(params) => (
              <TextField size="small" {...params} helperText={null} />
            )}
          />
        </Box>
        <HeightIcon
          fontSize="large"
          color={filterToggle ? 'primary' : 'disabled'}
          sx={{ width: '100%' }}
        />
        <Box my={0} aria-label="datePickerToBox">
          <DatePicker
            data-testid="datePickerTo"
            disabled={!filterToggle}
            inputFormat="MMM-yyyy"
            views={['month', 'year']}
            label="To"
            minDate={valueFrom ?? new Date('1980-01-01')}
            maxDate={new Date()}
            value={valueTo}
            onChange={(e) => handleChange(e, 'to')}
            renderInput={(params) => (
              <TextField size="small" {...params} helperText={null} />
            )}
          />
        </Box>
      </LocalizationProvider>
    </div>
  );
}
