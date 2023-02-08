import { Button } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { getFilteredData } from '../../../state/map/actions/getFilteredData';

export const DownloadDataControl = () => {
  const dispatch = useAppDispatch();

  const currentFilters = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);

  const handleDownload = () => {
    dispatch(getFilteredData(currentFilters));
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={occurrenceData.length === 0}
      variant="contained"
      className="umami--click--download-filtered"
      sx={{ margin: 0, marginTop: 2, width: '100%' }}
    >
      Download Filtered Data
    </Button>
  );
};
