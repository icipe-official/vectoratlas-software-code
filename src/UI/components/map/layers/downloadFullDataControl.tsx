import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  CircularProgress,
  Collapse,
  Box,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { downloadTemplate } from '../../../state/upload/actions/downloadTemplate';

export const DownloadFullDataControl = () => {
  const t = useTranslations('MapPage');
  const dispatch = useAppDispatch();
  const { user } = useUser();

  const isDownloading = useAppSelector(
    (state) => state.upload.isDownloadingTemplate
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [acceptLicense, setAcceptLicense] = useState(false);
  const [generateDOI, setGenerateDOI] = useState(false);
  const [includeDOI, setIncludeDOI] = useState(false);

  //  Separated First Name & Last Name
  const [subscribeToMailingList, setSubscribeToMailingList] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  // Autofill and split Auth0 user details into separate first/last name states
  useEffect(() => {
    if (user) {
      if (user.name) {
        const parts = user.name.trim().split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      } else {
        setFirstName(
          typeof user.given_name === 'string' ? user.given_name : ''
        );
        setLastName(
          typeof user.family_name === 'string' ? user.family_name : ''
        );
      }
      setEmail(user.email || '');
    }
  }, [user]);

  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  // Validation hook checking each field individually
  useEffect(() => {
    let message = '';

    if (!acceptLicense) {
      message = t('downloadData.errors.terms');
    } else if (includeDOI || subscribeToMailingList) {
      if (!firstName.trim()) {
        message =
          t('downloadData.errors.firstName') || 'First Name is required';
      } else if (!lastName.trim()) {
        message = t('downloadData.errors.lastName') || 'Last Name is required';
      } else if (!email.trim()) {
        message = t('downloadData.errors.email') || 'Email Address is required';
      } else if (!isValidEmail(email)) {
        message =
          t('downloadData.errors.invalidEmail') ||
          'Please enter a valid email address';
      }
    }

    setValidationMessage(message);
  }, [
    acceptLicense,
    includeDOI,
    subscribeToMailingList,
    firstName,
    lastName,
    email,
    t,
  ]);

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

      const response = await fetch('/vector-api/email-registry/subscribe', {
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

    // 1. Send subscription payload first; stop if it fails so error displays on screen
    if (subscribeToMailingList) {
      const isSubscribed = await handleSubscriptionCall();
      if (!isSubscribed) {
        return;
      }
    }

    // 2. Trigger file download via Redux
    await dispatch(
      downloadTemplate({
        dataType: 'full_data',
        dataSource: 'Vector Atlas',
        extension: 'zip',
      })
    );

    // 3. Reset form states and close dialog
    setSubscribeToMailingList(false);
    setOpenDialog(false);
  };

  return (
    <div>
      <Button
        onClick={() => setOpenDialog(true)}
        variant="contained"
        disabled={isDownloading}
        sx={{ margin: 0, marginTop: 2, width: '100%' }}
      >
        {t('downloadData.downloadFullData')}
      </Button>

      <Dialog
        open={openDialog}
        onClose={() => !isDownloading && setOpenDialog(false)}
      >
        <DialogTitle>{t('downloadData.downloadConfirmationTitle')}</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={1}>
            {/* Terms & Conditions Checkbox */}
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

            {/* Newsletter Subscription Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={subscribeToMailingList}
                  disabled={isDownloading}
                  onChange={(e) => setSubscribeToMailingList(e.target.checked)}
                />
              }
              label={
                t('downloadData.subscribeUpdates') ||
                'Subscribe to updates and dataset news'
              }
            />

            {/* Collapsible Name & Email Input Section */}
            <Collapse in={subscribeToMailingList || includeDOI}>
              <Box display="flex" flexDirection="column" gap={1.5} pt={1}>
                <TextField
                  label={(t('downloadData.firstName') || 'First Name') + ' *'}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  size="small"
                  margin="dense"
                  disabled={isDownloading}
                  variant="outlined"
                />

                <TextField
                  label={(t('downloadData.lastName') || 'Last Name') + ' *'}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  size="small"
                  margin="dense"
                  disabled={isDownloading}
                  variant="outlined"
                />

                <TextField
                  label={(t('downloadData.email') || 'Email Address') + ' *'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  size="small"
                  margin="dense"
                  disabled={isDownloading}
                  variant="outlined"
                />
              </Box>
            </Collapse>

            {/* <FormControlLabel */}
            {/*   control={ */}
            {/*     <Checkbox */}
            {/*       checked={includeDOI} */}
            {/*       disabled={isDownloading} */}
            {/*       onChange={(e) => { */}
            {/*         setIncludeDOI(e.target.checked); */}
            {/* */}
            {/*         if (!e.target.checked) { */}
            {/*           setGenerateDOI(false); */}
            {/*           setFirstName(user?.given_name || ''); */}
            {/*           setLastName(user?.family_name || ''); */}
            {/*           setEmail(user?.email || ''); */}
            {/*         } else { */}
            {/*           setGenerateDOI(true); */}
            {/*         } */}
            {/*       }} */}
            {/*     /> */}
            {/*   } */}
            {/*   label={t('downloadData.requestDoi')} */}
            {/* /> */}
            {/* */}
            {/* {includeDOI && ( */}
            {/*   <> */}
            {/*     <TextField */}
            {/*       label={t('downloadData.firstName') + ' *'} */}
            {/*       value={firstName} */}
            {/*       onChange={(e) => setFirstName(e.target.value)} */}
            {/*       fullWidth */}
            {/*       margin="dense" */}
            {/*       disabled={isDownloading} */}
            {/*     /> */}
            {/* */}
            {/*     <TextField */}
            {/*       label={t('downloadData.lastName') + ' *'} */}
            {/*       value={lastName} */}
            {/*       onChange={(e) => setLastName(e.target.value)} */}
            {/*       fullWidth */}
            {/*       margin="dense" */}
            {/*       disabled={isDownloading} */}
            {/*     /> */}
            {/* */}
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
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={isDownloading}>
            {t('downloadData.buttons.cancel')}
          </Button>

          <Button
            onClick={handleDownload}
            variant="contained"
            disabled={!!validationMessage || isDownloading}
          >
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
