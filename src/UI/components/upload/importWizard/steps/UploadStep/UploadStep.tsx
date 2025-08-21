import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Typography,
  Select,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Backdrop,
  Paper,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import ExpectedColumns from './components/ExpectedColumns';
import { DropZone } from './components/DropZone';
import SelectSheet from './components/SelectSheet';
import {
  ImportStepProps,
  ImportWizardState,
  SelectFieldOption,
} from '../../types';
import { NavigationPanel } from '../../components/NavigationPanel';
import { toast } from 'react-toastify';
import { StepType } from '../../ImportWizard';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useSpreadsheetImporter } from '../../hooks/useSpreadsheetImporter';
import { useTranslations } from 'next-intl';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props extends ImportStepProps {
  onFileAccepted: (v: ImportWizardState) => Promise<void>;
  onSelectWorksheet: (v: ImportWizardState) => Promise<void>;
  onSkipPostUploadSteps: (v: ImportWizardState) => Promise<void>;
}

const FormControlContainer = ({ children }: { children: React.ReactNode }) => (
  <FormControl fullWidth sx={{ mb: 3 }}>{children}</FormControl>
);

export const UploadStep = ({
  state,
  onContinue,
  onBack,
  onSkip,
  onFileAccepted,
  onSelectWorksheet,
  onSkipPostUploadSteps,
}: Props) => {
  const t = useTranslations('UploadWizardPage');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isLoading, setIsLoading] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [localMetadata, setLocalMetadata] = useState(state.metadata || {});
  const { uploadStepFields, allowSkipPostUploadStep } = useSpreadsheetImporter();

  useEffect(() => {
    setLocalMetadata(state.metadata || {});
  }, [state.metadata]);

  const validateForm = useCallback(() => {
    const requiredFields = uploadStepFields?.filter((fld) => fld.required);
    for (const field of requiredFields || []) {
      if (!localMetadata[field.key]) {
        const error = field.errorMessage ||
          t('uploadStep.errors.mandatoryField', { field: field.label?.toString() });
        return { isValid: false, error };
      }
    }
    return { isValid: true, error: '' };
  }, [localMetadata, uploadStepFields, t]);

  const validateStep = useCallback(() => {
    if (!state.selectedWorksheetName) {
      toast.error(t('uploadStep.errors.selectNotSelected'));
      return false;
    }
    const { isValid, error } = validateForm();
    if (!isValid) {
      toast.error(error);
      setIsLoading(false);
      return false;
    }
    return true;
  }, [state.selectedWorksheetName, validateForm, t]);

  const handleOnContinue = useCallback(async () => {
    setShowValidationErrors(true);
    setIsLoading(true);
    state.metadata = { ...localMetadata };
    if (!validateStep()) return setIsLoading(false);
    await onContinue(state);
    setIsLoading(false);
  }, [onContinue, state, validateStep, localMetadata]);

  const handleOnSkipLaterSteps = useCallback(async () => {
    setShowValidationErrors(true);
    setIsLoading(true);
    state.metadata = { ...localMetadata };
    if (!validateStep()) return setIsLoading(false);
    await onSkipPostUploadSteps(state);
    setIsLoading(false);
  }, [onSkipPostUploadSteps, state, validateStep, localMetadata]);

  const handleChange = (key: string, value: any) => {
    const newMetadata = { ...localMetadata, [key]: value || '' };
    setLocalMetadata(newMetadata);
    state.metadata = newMetadata;
  };

  const handleFieldTouch = (fieldKey: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const shouldShowFieldError = (fieldKey: string, required: boolean) => {
    if (!required) return false;
    return (showValidationErrors || touchedFields[fieldKey]) && !localMetadata[fieldKey];
  };

  const isFormValidForSubmit = useCallback(() => {
    const requiredFields = uploadStepFields?.filter((fld) => fld.required) || [];
    return !!state.selectedWorksheetName &&
      requiredFields.every(field => localMetadata[field.key]);
  }, [uploadStepFields, localMetadata, state.selectedWorksheetName]);

  // Check if there are any validation errors to show
  const hasValidationErrors = useCallback(() => {
    if (!showValidationErrors && Object.keys(touchedFields).length === 0) return false;
    
    const requiredFields = uploadStepFields?.filter((fld) => fld.required) || [];
    const hasFieldErrors = requiredFields.some(field => 
      shouldShowFieldError(field.key, true)
    );
    const hasWorksheetError = showValidationErrors && !state.selectedWorksheetName;
    
    return hasFieldErrors || hasWorksheetError;
  }, [showValidationErrors, touchedFields, uploadStepFields, localMetadata, state.selectedWorksheetName]);

  useEffect(() => {
    state.activeStep = StepType.upload;
  }, [state]);

  useEffect(() => {
    setIsValidForm(isFormValidForSubmit());
  }, [isFormValidForSubmit]);

  // Get responsive button labels
  const getContinueLabel = () => {
    if (!allowSkipPostUploadStep) return undefined;
    
    if (isSmall) {
      return t('uploadStep.buttons.advancedUpload') || 'Column Matching';
    }
    if (isMobile) {
      return t('uploadStep.buttons.advancedUpload') || 'Continue with Matching';
    }
    return t('uploadStep.buttons.advancedUpload') || 'Or Continue with column matching';
  };

  const getUploadButtonText = () => {
    if (isSmall) {
      return t('uploadStep.buttons.upload') || 'Upload';
    }
    return t('uploadStep.buttons.upload') || 'Quick Upload';
  };

  return (
    <Box sx={{ mt: 4, px: { xs: 1, sm: 2, md: 3 } }}>
      <Grid2 container spacing={3}>
        {/* Left side: Form */}
        <Grid2 xs={12} md={7}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ 
                mb: 2, 
                color: hasValidationErrors() ? 'error.main' : 'primary.main',
                fontSize: { 
                  xs: '0.875rem', 
                  sm: '1rem', 
                  md: '1.1rem',
                  lg: '1.25rem'
                },
                transition: 'color 0.3s ease-in-out',
                textAlign: 'center',
                lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                px: { xs: 1, sm: 2 }
              }}
            >
              {t('uploadStep.banner') || 'The values specified here will be used when generating a DOI for this dataset'}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form noValidate autoComplete="off">
              {uploadStepFields?.map((el) => {
                const fieldError = shouldShowFieldError(el.key, el.required || false);

                if (el.type === 'Text') {
                  return (
                    <FormControlContainer key={el.key}>
                      <TextField
                        fullWidth
                        label={el.label}
                        value={localMetadata[el.key] || ''}
                        onChange={(evt) => {
                          handleChange(el.key, evt.target.value);
                          el.onChange?.(evt.target.value, state);
                        }}
                        onBlur={() => handleFieldTouch(el.key)}
                        error={fieldError}
                        helperText={fieldError ? el.errorMessage || `${el.label} is required` : el.helperText}
                        size={isMobile ? "small" : "medium"}
                      />
                    </FormControlContainer>
                  );
                }

                if (el.type === 'TextArea') {
                  return (
                    <FormControlContainer key={el.key}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          mb: 1,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {el.label}{el.required && <span style={{ color: 'red' }}> *</span>}
                      </Typography>
                      <Box
                        sx={{
                          border: fieldError ? '2px solid red' : '1px solid #e0e0e0',
                          borderRadius: 1,
                          minHeight: { xs: 150, sm: 200 },
                          '&:focus-within': { borderColor: 'primary.main' }
                        }}
                        onBlur={() => handleFieldTouch(el.key)}
                      >
                        <ReactQuill
                          value={localMetadata[el.key] || ''}
                          onChange={(val) => {
                            handleChange(el.key, val);
                            el.onChange?.(val, state);
                          }}
                          placeholder={el.placeHolder}
                          theme="snow"
                        />
                      </Box>
                      <FormHelperText error={fieldError}>
                        {fieldError ? el.errorMessage || `${el.label} is required` : el.helperText}
                      </FormHelperText>
                    </FormControlContainer>
                  );
                }

                if (el.type === 'Select') {
                  return (
                    <FormControlContainer key={el.key}>
                      <Select
                        fullWidth
                        displayEmpty
                        value={localMetadata[el.key] || ''}
                        onChange={(evt: SelectChangeEvent) => {
                          handleChange(el.key, evt.target.value);
                          el.onChange?.(evt.target.value, state);
                        }}
                        onBlur={() => handleFieldTouch(el.key)}
                        error={fieldError}
                        size={isMobile ? "small" : "medium"}
                      >
                        {el.options?.map((opt: SelectFieldOption, idx: number) => (
                          <MenuItem key={idx} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={fieldError}>
                        {fieldError ? el.errorMessage || `${el.label} is required` : el.helperText}
                      </FormHelperText>
                    </FormControlContainer>
                  );
                }

                if (el.type === 'Checkbox') {
                  return (
                    <FormControlContainer key={el.key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={localMetadata[el.key] || false}
                            onChange={(evt) => {
                              handleChange(el.key, evt.target.checked);
                              handleFieldTouch(el.key);
                              el.onChange?.(evt, state);
                            }}
                            size={isMobile ? "small" : "medium"}
                          />
                        }
                        label={
                          <Typography 
                            variant="body1" 
                            color={fieldError ? 'error' : 'inherit'}
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {el.label}{el.required && <span style={{ color: 'red' }}> *</span>}
                          </Typography>
                        }
                      />
                      <FormHelperText error={fieldError}>
                        {fieldError ? el.errorMessage || `${el.label} is required` : el.helperText}
                      </FormHelperText>
                    </FormControlContainer>
                  );
                }

                return null;
              })}
            </form>
          </Paper>
        </Grid2>

        {/* Right side: Upload */}
        <Grid2 xs={12} md={5}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ 
                mb: 2, 
                color: 'primary.main', 
                textAlign: 'center',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {t('uploadStep.buttons.upload') || 'Upload File'}
            </Typography>
            <DropZone state={state} onFileAccepted={onFileAccepted} />

            <Divider sx={{ my: 3 }} />

            <SelectSheet state={state} onSelectWorksheet={onSelectWorksheet} />
          </Paper>
        </Grid2>
      </Grid2>

      {/* Custom Navigation for better control */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Paper elevation={1} sx={{ p: 2 }}>
          {allowSkipPostUploadStep ? (
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left side buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                {onBack && (
                  <Button
                    variant="outlined"
                    onClick={onBack}
                    disabled={isLoading}
                    size={isMobile ? "small" : "medium"}
                    sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                  >
                    {t('common.back') || 'Back'}
                  </Button>
                )}
              </Stack>

              {/* Right side buttons */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={1}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Button
                  disabled={!isFormValidForSubmit() || isLoading}
                  size={isMobile ? "small" : "medium"}
                  variant="contained"
                  onClick={handleOnSkipLaterSteps}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 120 },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {getUploadButtonText()}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleOnContinue}
                  disabled={isLoading}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 140 },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    backgroundColor: hasValidationErrors() ? 'error.main' : 'success.main',
                    color: 'white',
                    borderColor: hasValidationErrors() ? 'error.main' : 'success.main',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: hasValidationErrors() ? 'error.dark' : 'success.dark',
                      borderColor: hasValidationErrors() ? 'error.dark' : 'success.dark',
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.grey[400],
                      color: theme.palette.grey[600],
                      borderColor: theme.palette.grey[400],
                    }
                  }}
                >
                  {getContinueLabel()}
                </Button>
              </Stack>
            </Stack>
          ) : (
            // Fallback to original NavigationPanel if no skip option
            <NavigationPanel
              isLoading={isLoading}
              onNext={handleOnContinue}
              onPrev={onBack}
              onSkip={onSkip}
            />
          )}
        </Paper>
      </Box>

      {/* Loader */}
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};