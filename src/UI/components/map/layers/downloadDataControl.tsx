import { Button } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { getFilteredData } from '../../../state/map/actions/getFilteredData';

export const DownloadDataControl = () => {
  const dispatch = useAppDispatch();

  const currentFilters = useAppSelector((state) => state.map.filters);

  const handleDownload = () => {
    dispatch(getFilteredData(currentFilters));
  };

  return (
    <Button
      onClick={handleDownload}
      variant="contained"
      sx={{ margin: 0, marginTop: 2, width: '100%' }}
    >
      Download Filtered Data
    </Button>
  );
};
