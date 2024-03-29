import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { filterHandler } from '../../../../state/map/mapSlice';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { TimeRange } from '../../../../state/state.types';

const getTimezoneOffset = (value: Date) => value.getTimezoneOffset() * 60000;
const makeLocalAppearUTC = (value: number | null) => {
  if (!value) {
    return value;
  }
  const dateTime = new Date(value);
  const utcFromLocal = new Date(
    dateTime.getTime() + getTimezoneOffset(dateTime)
  );
  return utcFromLocal;
};

const localToUTC = (dateTime: Date) => {
  const utcFromLocal = new Date(
    dateTime.getTime() - getTimezoneOffset(dateTime)
  );
  return utcFromLocal;
};

export default function DateFilter(props: any) {
  const dispatch = useAppDispatch();

  const filters = useAppSelector((state) => state.map.filters);
  const timeRange = filters[props.filterName].value as TimeRange;
  const valueFrom = timeRange ? timeRange.start : null;
  const valueTo = timeRange ? timeRange.end : null;

  const handleChange = (event: any, timeSelect: string) => {
    if (timeSelect === 'from') {
      dispatch(
        filterHandler({
          filterName: props.filterName,
          filterOptions: {
            start: event ? localToUTC(event).getTime() : null,
            end: valueTo,
          },
        })
      );
    } else {
      dispatch(
        filterHandler({
          filterName: props.filterName,
          filterOptions: {
            start: valueFrom,
            end: event ? localToUTC(event).getTime() : null,
          },
        })
      );
    }
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}
    >
      <Typography
        variant="inherit"
        color="primary"
        fontSize={12}
        sx={{ paddingBottom: 1 }}
      >
        {props.filterTitle}
      </Typography>
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item md={6}>
              <DatePicker
                data-testid="from-date"
                inputFormat="MMM-yyyy"
                views={['month', 'year']}
                label="From"
                minDate={new Date('1980-01-01')}
                maxDate={new Date()}
                value={makeLocalAppearUTC(valueFrom)}
                onChange={(e) => handleChange(e, 'from')}
                renderInput={(params) => (
                  <TextField size="small" {...params} helperText={null} />
                )}
              />
            </Grid>
            <Grid item md={6}>
              <DatePicker
                data-testid="to-date"
                inputFormat="MMM-yyyy"
                views={['month', 'year']}
                label="To"
                minDate={valueFrom ?? new Date('1980-01-01')}
                maxDate={new Date()}
                value={makeLocalAppearUTC(valueTo)}
                onChange={(e) => handleChange(e, 'to')}
                renderInput={(params) => (
                  <TextField size="small" {...params} helperText={null} />
                )}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </div>
    </div>
  );
}
