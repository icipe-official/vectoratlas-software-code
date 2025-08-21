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
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
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
import { isValid } from 'date-fns';
import { useTranslations } from 'next-intl';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props extends ImportStepProps {
  onFileAccepted: (v: ImportWizardState) => Promise<void>;
  onSelectWorksheet: (v: ImportWizardState) => Promise<void>;
  onSkipPostUploadSteps: (v: ImportWizardState) => Promise<void>;
}

interface InputControlProps {
  children: React.ReactNode;
}

type ValidationResult = {
  isValid: boolean;
  error: string;
};

const FormControlContainer = ({ children }: InputControlProps) => {
  return (
    <FormControl style={{ width: '90%', padding: 10 }}>{children}</FormControl>
  );
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [isValidForm, setisValidForm] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  // Add local state for metadata to ensure React detects changes
  const [localMetadata, setLocalMetadata] = useState(state.metadata || {});

  const { uploadStepFields, allowSkipPostUploadStep } = useSpreadsheetImporter();

  // Update local metadata when state.metadata changes from external sources
  useEffect(() => {
    setLocalMetadata(state.metadata || {});
  }, [state.metadata]);

  const validateForm = useCallback(() => {
    const requiredFields = uploadStepFields?.filter((fld) => fld.required);
    let isValid = true;
    let error = '';

    for (const field of requiredFields) {
      if (!localMetadata[field.key]) {
        if (field.errorMessage) {
          error = field.errorMessage;
        } else {
          error = t('uploadStep.errors.mandatoryField', {
            field: field.label?.toString(),
          });
        }
        isValid = false;
        break;
      }
    }

    const res: ValidationResult = {
      isValid,
      error,
    };
    return res;
  }, [localMetadata, uploadStepFields, t]);

  const validateStep = useCallback(() => {
    if (!state.selectedWorksheetName) {
      toast.error(t('uploadStep.errors.selectNotSelected'));
      return false;
    }

    const { isValid, error } = validateForm();
    if (!isValid) {
      toast.error(`${error}`);
      setIsLoading(false);
      return false;
    } else {
      setIsLoading(false);
    }
    return true;
  }, [state.selectedWorksheetName, validateForm, t]);

  const handleOnContinue = useCallback(async () => {
    setShowValidationErrors(true);
    setIsLoading(true);
    
    // Sync local metadata to state before validation
    state.metadata = { ...localMetadata };
    
    if (!validateStep()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    await onContinue(state);
    setIsLoading(false);
  }, [onContinue, state, validateStep, localMetadata]);

  const handleOnSkipLaterSteps = useCallback(async () => {
    setShowValidationErrors(true);
    setIsLoading(true);
    
    // Sync local metadata to state before validation
    state.metadata = { ...localMetadata };
    
    if (!validateStep()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    await onSkipPostUploadSteps(state);
    setIsLoading(false);
  }, [onSkipPostUploadSteps, state, validateStep, localMetadata]);

  const handleChange = (key: string, value: any) => {
    const newMetadata = { ...localMetadata, [key]: value || '' };
    setLocalMetadata(newMetadata);
    // Also update the state immediately for consistency
    state.metadata = newMetadata;
  };

  const handleFieldTouch = (fieldKey: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  // Check if a specific field should show error
  const shouldShowFieldError = (fieldKey: string, required: boolean) => {
    if (!required) return false;
    const hasValue = localMetadata[fieldKey];
    const isTouched = touchedFields[fieldKey];
    return (showValidationErrors || isTouched) && !hasValue;
  };

  // Check if form is valid for button state
  const isFormValidForSubmit = useCallback(() => {
    const requiredFields = uploadStepFields?.filter((fld) => fld.required) || [];
    const hasWorksheet = !!state.selectedWorksheetName;
    const allRequiredFieldsFilled = requiredFields.every(field =>
      localMetadata[field.key]
    );
    return hasWorksheet && allRequiredFieldsFilled;
  }, [uploadStepFields, localMetadata, state.selectedWorksheetName]);

  useEffect(() => {
    state.activeStep = StepType.upload;
  }, [state]);

  useEffect(() => {
    const isValid = isFormValidForSubmit();
    setisValidForm(isValid);
  }, [isFormValidForSubmit]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        flex: 1,
        marginTop: 5,
        borderColor: '#e5e5e5',
        borderStyle: 'solid',
      }}
    >
      <Grid2 container spacing={2}>
        <Grid2 md={12}>
          <Typography
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              color: 'maroon',
            }}
            variant="subtitle2"
          >
            {t('uploadStep.banner') ||
              'The values specified here will be used when generating a DOI for this dataset'}
          </Typography>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 md={7}>
          <form noValidate autoComplete="off">
            {uploadStepFields?.map((el, idx) => {
              const fieldError = shouldShowFieldError(el.key, el.required || false);

              if (el.type === 'Text') {
                return (
                  <FormControlContainer key={el.key}>
                    <Box style={{ display: 'flex' }}>
                      <Typography variant="body1">{el.label}</Typography>
                      {el.required && (
                        <Typography
                          variant="body1"
                          style={{ color: 'red', marginLeft: 2 }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                    <TextField
                      value={localMetadata[el.key] || ''}
                      onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(el.key, evt.target.value);
                        el.onChange?.(evt.target.value, state);
                      }}
                      onBlur={() => handleFieldTouch(el.key)}
                      error={fieldError}
                      helperText={
                        fieldError
                          ? el.errorMessage || `${el.label} is required`
                          : el.helperText
                      }
                      inputProps={{ 'aria-label': 'controlled' }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-error': {
                            '& fieldset': {
                              borderColor: 'red',
                              borderWidth: '2px',
                            },
                          },
                        },
                      }}
                    />
                  </FormControlContainer>
                );
              }

              if (el.type === 'TextArea') {
                return (
                  <FormControlContainer key={el.key}>
                    <Box style={{ display: 'flex' }}>
                      <Typography variant="body1">{el.label}</Typography>
                      {el.required && (
                        <Typography
                          variant="body1"
                          style={{ color: 'red', marginLeft: 2 }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                    <Box
                      style={{
                        height: '200px',
                        border: fieldError
                          ? '2px solid red'
                          : '1px solid #e0e0e0',
                        borderRadius: '4px',
                      }}
                      onBlur={() => handleFieldTouch(el.key)}
                    >
                      <ReactQuill
                        onChange={(val) => {
                          handleChange(el.key, val);
                          el.onChange?.(val, state);
                        }}
                        value={localMetadata[el.key] || ''}
                        placeholder={el.placeHolder}
                        style={{ minHeight: '300px', overflow: 'auto' }}
                        theme="snow"
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            [{ header: '1' }, { header: '2' }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ align: [] }],
                            [
                              { list: 'ordered' },
                              { list: 'bullet' },
                              { indent: '-1' },
                              { indent: '+1' },
                            ],
                            [{ color: [] }, { background: [] }],
                            ['image', 'clean'],
                          ],
                        }}
                        formats={[
                          'header',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'list',
                          'bullet',
                          'link',
                          'indent',
                          'align',
                          'image',
                          'color',
                          'background',
                        ]}
                      />
                    </Box>
                    <FormHelperText error={fieldError}>
                      {fieldError
                        ? el.errorMessage || `${el.label} is required`
                        : el.helperText}
                    </FormHelperText>
                  </FormControlContainer>
                );
              }

              if (el.type === 'Select') {
                return (
                  <FormControlContainer key={el.key}>
                    <Box style={{ display: 'flex' }}>
                      <Typography variant="body1">{el.label}</Typography>
                      {el.required && (
                        <Typography
                          variant="body1"
                          style={{ color: 'red', marginLeft: 2 }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                    <Select
                      value={localMetadata[el.key] || ''}
                      label={el.label}
                      onChange={(evt: SelectChangeEvent) => {
                        handleChange(el.key, evt.target.value);
                        el.onChange?.(evt.target.value, state);
                      }}
                      onBlur={() => handleFieldTouch(el.key)}
                      error={fieldError}
                      sx={{
                        '&.Mui-error': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'red',
                            borderWidth: '2px',
                          },
                        },
                      }}
                    >
                      {el.options?.map((opt: SelectFieldOption, idx: number) => (
                        <MenuItem key={idx} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error={fieldError}>
                      {fieldError
                        ? el.errorMessage || `${el.label} is required`
                        : el.helperText}
                    </FormHelperText>
                  </FormControlContainer>
                );
              }

              if (el.type === 'Checkbox') {
                return (
                  <FormControlContainer key={el.key}>
                    <FormControlLabel
                      style={{
                        marginTop: 10,
                        color: fieldError ? 'red' : 'inherit',
                      }}
                      label={
                        <Box style={{ display: 'flex' }}>
                          <Typography
                            variant="body1"
                            color={fieldError ? 'red' : 'inherit'}
                          >
                            {el.label}
                          </Typography>
                          {el.required && (
                            <Typography
                              variant="body1"
                              style={{ color: 'red', marginLeft: 2 }}
                            >
                              *
                            </Typography>
                          )}
                        </Box>
                      }
                      control={
                        <Checkbox
                          checked={localMetadata[el.key] || false}
                          onChange={(evt) => {
                            handleChange(el.key, evt.target.checked);
                            handleFieldTouch(el.key);
                            el.onChange?.(evt, state);
                          }}
                          sx={{
                            color: fieldError ? 'red' : 'default',
                            '&.Mui-checked': {
                              color: fieldError ? 'red' : 'primary.main',
                            },
                          }}
                        />
                      }
                    />
                    <FormHelperText error={fieldError}>
                      {fieldError
                        ? el.errorMessage || `${el.label} is required`
                        : el.helperText}
                    </FormHelperText>
                  </FormControlContainer>
                );
              }
              return null;
            })}
          </form>
        </Grid2>

        <Grid2 md={5}>
          <Grid2 md={12}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              {t('uploadStep.buttons.upload') || 'Upload'}
            </Typography>
            <DropZone state={state} onFileAccepted={onFileAccepted} />
          </Grid2>
          <Grid2
            xs={10}
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              justifyItems: 'center',
              borderColor: '#e5e5e5',
              borderWidth: 1,
              borderStyle: 'solid',
              margin: 5,
              flexDirection: 'column',
            }}
          >
            <SelectSheet state={state} onSelectWorksheet={onSelectWorksheet} />
          </Grid2>
        </Grid2>
      </Grid2>

      <NavigationPanel
        isLoading={isLoading}
        onNext={() => handleOnContinue()}
        onPrev={onBack}
        onSkip={onSkip}
        continueLabel={
          allowSkipPostUploadStep
            ? t('uploadStep.buttons.advancedUpload') ||
              'Or Continue with column matching'
            : undefined
        }
        preContinueButton={
          allowSkipPostUploadStep ? (
            <Button
              disabled={!isFormValidForSubmit() || isLoading}
              size="small"
              variant="contained"
              onClick={async () => {
                console.log('Pre continue clicked');
                await handleOnSkipLaterSteps();
              }}
            >
              {t('uploadStep.buttons.upload') || 'Upload'}
            </Button>
          ) : undefined
        }
      />

      <Backdrop
        sx={(theme) => ({
          color: '#fff',
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};