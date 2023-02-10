import * as React from 'react';
import { Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { bionomicsToggle } from '../../../../state/map/mapSlice';

export const FilterToggleExclusive = (props: any) => {
  const includeBionomics= useAppSelector((state) => state.map.filters.includeBionomics);
  const dispatch = useAppDispatch();
  
  const marginCorrect = {
    '& .MuiSwitch-switchBase': {
        margin: 0,
    }
  }

  const handleBionomicsSwitch =() =>{
    dispatch(bionomicsToggle(!includeBionomics.value))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
      }}
    >
        <Typography
        variant="inherit"
        color="primary"
        align='center'
        fontSize={14}
        sx={{ textAlign: 'center'}}
      >
        {props.filterTitle}
      </Typography>
      <Switch sx={marginCorrect} checked={includeBionomics.value} onChange={handleBionomicsSwitch}/>
    </div>
  );
}

export default FilterToggleExclusive
