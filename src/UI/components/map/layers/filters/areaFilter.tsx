import ToggleButton from '@mui/material/ToggleButton';
import React, { useCallback, useState } from 'react';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import {
  toggleAreaMode,
  updateAreaFilter,
} from '../../../../state/map/mapSlice';
import { Button } from '@mui/material';

export const AreaFilters = () => {
  const dispatch = useAppDispatch();
  const areaModeOn = useAppSelector((state) => state.map.areaSelectModeOn);
  const areaCoordinates = useAppSelector(
    (state) => state.map.filters.areaCoordinates
  );

  const handleChange = useCallback(() => {
    dispatch(toggleAreaMode(!areaModeOn));
  }, [dispatch, areaModeOn]);

  const handleReset = useCallback(() => {
    dispatch(updateAreaFilter([]));
  }, [dispatch]);

  const enableRemoveButton =
    areaCoordinates && areaCoordinates.value.length > 0;

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
        Select by area
      </Typography>
      <div>
        <ToggleButton
          value="check"
          sx={{ width: 50, marginLeft: 0, marginRight: '100px' }}
          selected={areaModeOn}
          onChange={handleChange}
        >
          <FormatShapesIcon />
        </ToggleButton>
        <Button
          disabled={!enableRemoveButton}
          variant="contained"
          onClick={handleReset}
        >
          Remove selection
        </Button>
      </div>
    </div>
  );
};
