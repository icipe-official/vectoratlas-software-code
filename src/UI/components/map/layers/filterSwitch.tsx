import * as React from 'react';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { activeFilterToggle } from '../../../state/mapSlice';

export default function FilterSwitch(filterObject: any) {
  const filterToggle = useAppSelector(
    (state: any) => state.map.set_filters[`set${filterObject.filterName}`]
  );

  const dispatch = useAppDispatch();

  const handleToggle = (filterName: string) => {
    dispatch(activeFilterToggle(`set${filterName}`));
  };

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <FormGroup aria-label="position" row sx={{ width: '100%' }}>
        <FormControlLabel
          data-testId="Switch"
          value={filterObject.filterName}
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
              {filterObject.filterName}
            </Typography>
          }
          labelPlacement="start"
          sx={{
            width: '100%',
            justifyContent: 'space-between',
            m: 0,
          }}
          onChange={() => handleToggle(filterObject.filterName)}
        />
      </FormGroup>
    </FormControl>
  );
}
