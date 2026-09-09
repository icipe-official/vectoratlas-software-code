import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useTranslations } from 'next-intl';

// 1. Import the new background export thunk instead of getFilteredData
import { triggerBackgroundExport } from '../../../state/map/actions/triggerbackgroundexport';

// Single shared text size/line-height for every label, header, and bullet in the dialog.
const DIALOG_TEXT_SX = { fontSize: '0.9rem', lineHeight: 1.5 };
// Shared link style so every hyperlink in the dialog (CC deed, footnotes, VADB, DOI) looks the same.
const LINK_STYLE: React.CSSProperties = {
  color: 'green',
  textDecoration: 'underline',
};

// Reusable checkbox row. MUI's default Checkbox has ~9px of internal hit-area padding
// around the icon, which throws off alignItems:'flex-start' on multi-line labels
// (the icon still floats toward the middle of that padding, not the label's first line).
// Stripping the padding and using a small explicit top offset fixes that reliably.
const CheckboxRow = ({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}) => (
  <Box
    sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', mb: '10px' }}
  >
    <Checkbox
      checked={checked}
      onChange={onChange}
      sx={{ padding: 0, mt: '1px' }}
    />
    <Typography
      component="label"
      sx={{ ...DIALOG_TEXT_SX, cursor: 'pointer' }}
      onClick={() => onChange({ target: { checked: !checked } } as any)}
    >
      {children}
    </Typography>
  </Box>
);

export const DownloadDataControl = () => {
  const t = useTranslations('MapPage');
  const dispatch = useAppDispatch();
  const { user } = useUser();

  const currentFilters = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);
  const filteredOccurrenceData = useAppSelector(
    (state) => state.map.filteredOccurrenceData
  );

  const [openDialog, setOpenDialog] = useState(false);

  // Three separate T&C checkboxes — all required for Continue to enable
  const [acceptLicense, setAcceptLicense] = useState(false);
  const [acceptCitation, setAcceptCitation] = useState(false);
  const [acceptDataRetention, setAcceptDataRetention] = useState(false);

  // Optional "notify me" checkbox
  const [notifyMe, setNotifyMe] = useState(false);

  const [generateDOI, setGenerateDOI] = useState(false);
  const [includeDOI, setIncludeDOI] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

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

  // Computed directly during render (not via useEffect) so there's no
  // stale-state window where Continue is briefly enabled before checks catch up.
  const getValidationMessage = () => {
    if (!acceptLicense) return t('downloadData.errors.terms');
    if (!acceptCitation) return t('downloadData.errors.citation');
    if (!acceptDataRetention) return t('downloadData.errors.dataRetention');
    if (includeDOI) {
      if (!name.trim()) return t('downloadData.errors.name');
      if (!email.trim()) return t('downloadData.errors.email');
      if (!isValidEmail(email)) return t('downloadData.errors.invalidEmail');
    }
    return '';
  };

  const validationMessage = getValidationMessage();

  const handleDownload = () => {
    if (validationMessage) return;

    const ids = (filteredOccurrenceData || []).map((e) => e.id);
    // 2. Dispatch the new background export action
    dispatch(
      triggerBackgroundExport({
        filters: currentFilters,
        generateDoi: generateDOI,
        downloaderName: name,
        downloaderEmail: email,
        occurrenceIds: ids,
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

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('downloadData.downloadConfirmationTitle')}</DialogTitle>
        <DialogContent>
          {/* Checkbox 1: accept CC BY-NC 4.0 terms */}
          <CheckboxRow
            checked={acceptLicense}
            onChange={(e) => setAcceptLicense(e.target.checked)}
          >
            {t('downloadData.termsA')}&nbsp;
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.en"
              target="_blank"
              rel="noreferrer"
              style={LINK_STYLE}
            >
              {t('downloadData.termsB')}
            </a>
            .
          </CheckboxRow>

          {/* Full CC BY-NC 4.0 terms summary, matching the license deed's footnote links */}
          <div style={{ marginLeft: '32px', marginBottom: '16px' }}>
            <Typography sx={{ ...DIALOG_TEXT_SX, margin: '4px 0' }}>
              {t('downloadData.licenseTerms.underTheFollowingTerms')}
            </Typography>
            <Typography
              component="ul"
              sx={{ ...DIALOG_TEXT_SX, margin: '4px 0', paddingLeft: '20px' }}
            >
              <li>
                <strong>
                  {t('downloadData.licenseTerms.attributionTitle')}
                </strong>{' '}
                — You must give{' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/deed.en#ref-appropriate-credit"
                  target="_blank"
                  rel="noreferrer"
                  style={LINK_STYLE}
                >
                  appropriate credit
                </a>
                , provide a link to the license, and{' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/deed.en#ref-indicate-changes"
                  target="_blank"
                  rel="noreferrer"
                  style={LINK_STYLE}
                >
                  indicate if changes were made
                </a>
                .
              </li>
              <li>
                <strong>
                  {t('downloadData.licenseTerms.nonCommercialTitle')}
                </strong>{' '}
                — You may not use the material for{' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/deed.en#ref-commercial-purposes"
                  target="_blank"
                  rel="noreferrer"
                  style={LINK_STYLE}
                >
                  commercial purposes
                </a>
                .
              </li>
              <li>
                <strong>
                  {t('downloadData.licenseTerms.noAdditionalRestrictionsTitle')}
                </strong>{' '}
                — You may not apply legal terms or{' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/deed.en#ref-technological-measures"
                  target="_blank"
                  rel="noreferrer"
                  style={LINK_STYLE}
                >
                  technological measures
                </a>{' '}
                that legally restrict others from doing anything the license
                permits.
              </li>
            </Typography>
            <Typography sx={{ ...DIALOG_TEXT_SX, margin: '4px 0' }}>
              {t('downloadData.licenseTerms.youAreFreeTo')}
            </Typography>
            <Typography
              component="ul"
              sx={{ ...DIALOG_TEXT_SX, margin: '4px 0', paddingLeft: '20px' }}
            >
              <li>
                <strong>{t('downloadData.licenseTerms.shareTitle')}</strong> —{' '}
                {t('downloadData.licenseTerms.shareText')}
              </li>
              <li>
                <strong>{t('downloadData.licenseTerms.adaptTitle')}</strong> —{' '}
                {t('downloadData.licenseTerms.adaptText')}
              </li>
            </Typography>
          </div>

          <Typography
            sx={{ ...DIALOG_TEXT_SX, fontWeight: 600, margin: '0 0 8px' }}
          >
            {t('downloadData.pleaseAlsoAgree')}
          </Typography>

          {/* Checkbox 2: commitment to cite the Vector Atlas */}
          <CheckboxRow
            checked={acceptCitation}
            onChange={(e) => setAcceptCitation(e.target.checked)}
          >
            {t('downloadData.citationCommitmentA')}&nbsp;
            <a
              href="https://vectoratlas.icipe.org/"
              target="_blank"
              rel="noreferrer"
              style={LINK_STYLE}
            >
              {t('downloadData.citationCommitmentUrlLabel')}
            </a>
            , {t('downloadData.citationCommitmentB')}&nbsp;
            <a
              href="https://doi.org/10.60798/DSVG-T752"
              target="_blank"
              rel="noreferrer"
              style={LINK_STYLE}
            >
              {t('downloadData.citationCommitmentDoiLabel')}
            </a>
            .
          </CheckboxRow>

          {/* Checkbox 3: commitment to retain data source info in adaptations */}
          <CheckboxRow
            checked={acceptDataRetention}
            onChange={(e) => setAcceptDataRetention(e.target.checked)}
          >
            {t('downloadData.dataRetentionCommitment')}
          </CheckboxRow>

          <Typography
            sx={{ ...DIALOG_TEXT_SX, fontWeight: 600, margin: '8px 0 8px' }}
          >
            {t('downloadData.pleaseConfirm')}
          </Typography>

          {/* Checkbox 4 (optional): notify me when new data is added */}
          <CheckboxRow
            checked={notifyMe}
            onChange={(e) => setNotifyMe(e.target.checked)}
          >
            {t('downloadData.notifyMe')}
          </CheckboxRow>

          <CheckboxRow
            checked={includeDOI}
            onChange={(e) => {
              setIncludeDOI(e.target.checked);
              if (!e.target.checked) {
                setGenerateDOI(false);
                setName(user ? user.name || '' : '');
                setEmail(user ? user.email || '' : '');
              } else {
                setGenerateDOI(true);
              }
            }}
          >
            {t('downloadData.requestDoi')}
          </CheckboxRow>

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
            <Typography
              sx={{ ...DIALOG_TEXT_SX, color: 'red', marginTop: '8px' }}
            >
              {validationMessage}
            </Typography>
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
