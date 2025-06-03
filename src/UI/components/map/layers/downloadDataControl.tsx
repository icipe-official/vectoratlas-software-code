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
import { useTranslations } from 'next-intl';

export const DownloadDataControl = () => {
  const t = useTranslations('MapPage');
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
      message = t('downloadData.errors.terms');
    } else if (includeDOI) {
      if (!name.trim()) {
        message = t('downloadData.errors.name');
      } else if (!email.trim()) {
        message = t('downloadData.errors.email');
      } else if (!isValidEmail(email)) {
        message = t('downloadData.errors.invalidEmail');
      }
    }

    setValidationMessage(message);
  }, [acceptLicense, includeDOI, name, email]);

  const handleDownload = () => {
    if (validationMessage) return;

    dispatch(
      getFilteredData({
        filters: currentFilters,
        generateDoi: generateDOI,
        downloaderName: name,
        downloaderEmail: email,
      })
    );
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
        {t('downloadData.downloadFilteredData')}
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('downloadData.downloadConfirmationTitle')}</DialogTitle>
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
                {t('downloadData.termsA')}&nbsp;
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/deed.en"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'green' }}
                >
                  {t('downloadData.termsB')}
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
                  } else if (e.target.checked) {
                    setGenerateDOI(true);
                  }
                }}
              />
            }
            label={t('downloadData.requestDoi')}
          />
          {includeDOI && (
            <>
              <TextField
                label={t('downloadData.fullName') + ' *'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label={t('downloadData.email') + ' *'}
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
          <Button onClick={() => setOpenDialog(false)}>
            {t('downloadData.buttons.cancel')}
          </Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            disabled={!!validationMessage}
          >
            {t('downloadData.buttons.continue')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
