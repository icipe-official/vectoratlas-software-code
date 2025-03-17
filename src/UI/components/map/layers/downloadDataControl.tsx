import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { getFilteredData } from '../../../state/map/actions/getFilteredData';

export const DownloadDataControl = () => {
  const dispatch = useAppDispatch();

  const currentFilters = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);

  const [openDialog, setOpenDialog] = useState(false);
  const [acceptLicense, setAcceptLicense] = useState(false);
  const [generateDOI, setGenerateDOI] = useState(false);
  const [includeDOI, setIncludeDOI] = useState(false);

  const triggerDOIWorkflow = () => {
    // Empty function for now
  };

  const handleDownload = () => {
    if (!acceptLicense) return; // Prevent proceeding if the license isn't accepted

    dispatch(getFilteredData(currentFilters));

    if (generateDOI) {
      triggerDOIWorkflow();
    }

    setOpenDialog(false);
  };

  return (
    <div>
      <Button
        onClick={() => setOpenDialog(true)}
        disabled={occurrenceData.length === 0}
        variant="contained"
        className="umami--click--download-filtered"
        sx={{ margin: 0, marginTop: 2, width: '100%' }}
      >
        Download Filtered Data
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Download Confirmation</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptLicense}
                onChange={(e) => setAcceptLicense(e.target.checked)}
              />
            }
            label={
              <span>
                I have read and agree to the&nbsp;
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/deed.en"
                  target="_blank"
                  onClick={() => {}}
                  rel="noreferrer"
                  style={{ color: 'blue' }}
                >
                  Terms and Conditions
                </a>
              </span>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeDOI}
                onChange={(e) => {
                  setIncludeDOI(e.target.checked);
                  if (!e.target.checked) {
                    setGenerateDOI(false);
                  }
                }}
              />
            }
            label="Request DOI for this filtered data"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDownload}
            disabled={!acceptLicense}
            variant="contained"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
