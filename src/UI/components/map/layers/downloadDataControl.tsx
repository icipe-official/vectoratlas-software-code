import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { getFilteredData } from '../../../state/map/actions/getFilteredData';
import { useUser } from '@auth0/nextjs-auth0/client';

export const DownloadDataControl = () => {
  const dispatch = useAppDispatch();
  const { user } = useUser();

  const currentFilters = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);

  const [openDialog, setOpenDialog] = useState(false);
  const [acceptLicense, setAcceptLicense] = useState(false);
  const [generateDOI, setGenerateDOI] = useState(false);
  const [includeDOI, setIncludeDOI] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    let message = '';

    if (!acceptLicense) {
      message = 'You must accept the terms to proceed.';
    } else if (includeDOI) {
      if (!name.trim()) {
        message = 'Full Name is required.';
      } else if (!email.trim()) {
        message = 'Email Address is required.';
      } else if (!isValidEmail(email)) {
        message = 'Please enter a valid email address.';
      }
    }

    setValidationMessage(message);
  }, [acceptLicense, includeDOI, name, email]);

  const triggerDOIWorkflow = () => {
    // Handle DOI workflow (e.g., API call, validation, etc.)
  };

  const handleDownload = () => {
    if (validationMessage) return;

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
                  rel="noreferrer"
                  style={{ color: 'green' }}
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
                    setName(user ? user.name || '' : '');
                    setEmail(user ? user.email || '' : '');
                  }
                }}
              />
            }
            label="Request DOI for this filtered data"
          />
          {includeDOI && (
            <>
              <TextField
                label="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Email Address *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="dense"
              />
            </>
          )}
          {validationMessage && (
            <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '8px' }}>
              {validationMessage}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            disabled={!!validationMessage}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

