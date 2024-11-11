import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { getFilteredData } from '../../../state/map/actions/getFilteredData';
import ConfirmationDialog from '../../shared/ConfirmationDialog';

interface Props {
  withDOI?: boolean;
}

export const DownloadDataControl = (props: Props) => {
  const dispatch = useAppDispatch();

  const currentFilters = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);

  const [withDOI, setWithDOI] = useState(false);

  const handleDownload = (evt: any, withDoi: boolean = false) => {
    const filters = { withDoi, ...currentFilters };
    dispatch(getFilteredData(currentFilters));
  };

  const handleConfirmation = () => {
    // Perform action upon confirmation
    console.log('Confirmed!');
  };

  return (
    <div>
      <Button
        onClick={(evt: any) => handleDownload(evt, false)}
        disabled={occurrenceData.length === 0}
        variant="contained"
        className="umami--click--download-filtered"
        sx={{ margin: 0, marginTop: 2, width: '100%' }}
      >
        Download Filtered Data
      </Button>
      <Button
        component="label"
        onClick={(evt: any) => handleDownload(evt, true)}
        disabled={occurrenceData.length === 0}
        variant="contained"
        className="umami--click--download-filtered"
        sx={{ margin: 0, marginTop: 2, width: '100%' }}
      >
        Download Filtered Data with DOI
      </Button>
      {props.withDOI && (
        <ConfirmationDialog
          title="Confirmation"
          description="Are you sure you want to generate a DOI for this filtered data?"
          response={handleConfirmation}
        >
          {(showDialog: boolean) => (
            <button
            // onClick={() => {
            //   showDialog();
            // }}
            >
              Open Confirmation Dialog
            </button>
          )}
        </ConfirmationDialog>
      )}
    </div>
  );
};
