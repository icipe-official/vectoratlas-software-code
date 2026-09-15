import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  CircularProgress, // 1. Imported MUI spinner
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '../../../state/hooks'; // 2. Added useAppSelector
import { downloadTemplate } from '../../../state/upload/actions/downloadTemplate';

export const DownloadFullDataControl = () => {
  const t = useTranslations('MapPage');
  const dispatch = useAppDispatch();
  const { user } = useUser();

  // 3. Grab the loading state from Redux
  const isDownloading = useAppSelector(
    (state) => state.upload.isDownloadingTemplate
  );

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
  }, [acceptLicense, includeDOI, name, email, t]);

  // Mailing List Subscription Request Handler
  const handleSubscriptionCall = async (): Promise<boolean> => {
    if (!subscribeToMailingList || !email.trim()) return false;

    try {
      const payload = {
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        notifications_enabled: true,
      };

      const response = await fetch('/vector-api/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Subscription API failed:', response.status, errorData);
        setValidationMessage(
          errorData.message || `Subscription failed (HTTP ${response.status})`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Mailing list network error:', error);
      setValidationMessage(
        'Network error while connecting to the subscription service.'
      );
      return false;
    }
  };

  const handleDownload = async () => {
    if (validationMessage) return;

    // Await the dispatch so the dialog stays open while downloading
    await dispatch(
      downloadTemplate({
        dataType: 'full_data',
        dataSource: 'Vector Atlas',
        extension: 'zip',
      })
    );

    setOpenDialog(false);
  };

  return (
    <div>
      <Button
        onClick={() => setOpenDialog(true)}
        variant="contained"
        disabled={isDownloading} // Optional: Disable main button if already downloading
        sx={{ margin: 0, marginTop: 2, width: '100%' }}
      >
        {t('downloadData.downloadFullData')}
      </Button>

      {/* Prevent closing by clicking outside if downloading */}
      <Dialog
        open={openDialog}
        onClose={() => !isDownloading && setOpenDialog(false)}
      >
        <DialogTitle>{t('downloadData.downloadConfirmationTitle')}</DialogTitle>

        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptLicense}
                onChange={(e) => setAcceptLicense(e.target.checked)}
                disabled={isDownloading}
              />
            }
            label={
              <span>
                {t('downloadData.termsA')}&nbsp;
                <a
                  href="https://creativecommons.org"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'green' }}
                >
                  {t('downloadData.termsB')}
                </a>
              </span>
            }
          />

          {/* <FormControlLabel */}
          {/*   control={ */}
          {/*     <Checkbox */}
          {/*       checked={includeDOI} */}
          {/*       disabled={isDownloading} */}
          {/*       onChange={(e) => { */}
          {/*         setIncludeDOI(e.target.checked); */}
          {/**/}
          {/*         if (!e.target.checked) { */}
          {/*           setGenerateDOI(false); */}
          {/*           setName(user?.name || ''); */}
          {/*           setEmail(user?.email || ''); */}
          {/*         } else { */}
          {/*           setGenerateDOI(true); */}
          {/*         } */}
          {/*       }} */}
          {/*     /> */}
          {/*   } */}
          {/*   label={t('downloadData.requestDoi')} */}
          {/* /> */}
          {/**/}
          {/* {includeDOI && ( */}
          {/*   <> */}
          {/*     <TextField */}
          {/*       label={t('downloadData.fullName') + ' *'} */}
          {/*       value={name} */}
          {/*       onChange={(e) => setName(e.target.value)} */}
          {/*       fullWidth */}
          {/*       margin="dense" */}
          {/*       disabled={isDownloading} */}
          {/*     /> */}
          {/**/}
          {/*     <TextField */}
          {/*       label={t('downloadData.email') + ' *'} */}
          {/*       type="email" */}
          {/*       value={email} */}
          {/*       onChange={(e) => setEmail(e.target.value)} */}
          {/*       fullWidth */}
          {/*       margin="dense" */}
          {/*       disabled={isDownloading} */}
          {/*     /> */}
          {/*   </> */}
          {/* )} */}
          {/* */}
          {validationMessage && (
            <p style={{ color: 'red', fontSize: '0.9rem', marginTop: 8 }}>
              {validationMessage}
            </p>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            disabled={isDownloading} // Disable cancel while downloading
          >
            {t('downloadData.buttons.cancel')}
          </Button>

          <Button
            onClick={handleDownload}
            variant="contained"
            disabled={!!validationMessage || isDownloading}
          >
            {/* 5. Render spinner or text based on state */}
            {isDownloading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('downloadData.buttons.continue')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
