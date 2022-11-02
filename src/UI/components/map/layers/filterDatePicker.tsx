import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import Box from '@mui/material/Box';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import HeightIcon from '@mui/icons-material/Height';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { activeFilterToggle } from '../../../state/mapSlice';

export default function ViewsDatePicker(filterObject: any) {
  const filterToggle = useAppSelector(
    (state: any) => state.map.filters[`set${filterObject.filterTitle}`]
  );
  const [valueFrom, setValueFrom] = useState<Date | null>(new Date());
  const [valueTo, setValueTo] = useState<Date | null>(new Date());

  const dispatch = useAppDispatch();

  const handleToggle = (filterName: string) => {
    dispatch(activeFilterToggle(`set${filterName}`));
    console.log(`set${filterName}`, 'picker');
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
    >
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormGroup aria-label="position" row sx={{ width: '100%' }}>
          <FormControlLabel
            value="date-time"
            control={
              <Switch
                color="primary"
                size="small"
                sx={{
                  '.MuiSwitch-switchBase': {
                    margin: 0,
                  },
                }}
              />
            }
            label={
              <Typography
                variant="inherit"
                color={filterToggle === true ? 'primary' : 'textSecondary'}
                fontSize={12}
              >
                Time
              </Typography>
            }
            labelPlacement="start"
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              m: 0,
            }}
            onChange={() => handleToggle(filterObject.filterTitle)}
          />
        </FormGroup>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box mt={2}>
          <DatePicker
            disabled={!filterToggle}
            inputFormat="MM-yyyy"
            views={['year', 'month']}
            label="From"
            minDate={new Date('1980-01-01')}
            maxDate={new Date()}
            value={valueFrom}
            onChange={setValueFrom}
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
        <Box my={0}>
          <DatePicker
            disabled={!filterToggle}
            inputFormat="MM-yyyy"
            views={['year', 'month']}
            label="To"
            minDate={valueFrom ?? new Date('1980-01-01')}
            maxDate={new Date()}
            value={valueTo}
            onChange={setValueTo}
            renderInput={(params) => (
              <TextField size="small" {...params} helperText={null} />
            )}
          />
        </Box>
      </LocalizationProvider>
    </div>
  );
}
