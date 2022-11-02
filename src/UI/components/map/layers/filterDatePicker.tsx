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

export default function ViewsDatePicker() {
  const [filterToggle, setFilterToggle] = useState(false);
  const [valueFrom, setValueFrom] = useState<Date | null>(new Date());
  const [valueTo, setValueTo] = useState<Date | null>(new Date());

  const handleToggle = () => {
    setFilterToggle(!filterToggle);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormGroup aria-label="position" row sx={{ width: '100%' }}>
          <FormControlLabel
            value="date-time"
            control={<Switch color="primary" size="small" />}
            label={
              <Typography
                variant="inherit"
                color={filterToggle === true ? 'primary' : 'textSecondary'}
                fontSize={12}
              >
                Date-Time
              </Typography>
            }
            labelPlacement="start"
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              m: 0,
            }}
            onChange={handleToggle}
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
            disabled={!filterToggle}s
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
