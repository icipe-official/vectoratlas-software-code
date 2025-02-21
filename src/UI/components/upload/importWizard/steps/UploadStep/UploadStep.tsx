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

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props extends ImportStepProps {
  onFileAccepted: (v: ImportWizardState) => Promise<void>;
  onSelectWorksheet: (v: ImportWizardState) => Promise<void>;
  onSkipPostUploadSteps: (v: ImportWizardState) => Promise<void>;
}

interface InputControlProps {
  children: React.ReactNode;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const { uploadStepFields, allowSkipPostUploadStep } =
    useSpreadsheetImporter();
  // const stateUpdater = (uploadState: ImportWizardState) => {
  //   state = { ...state, ...uploadState };
  // };

  // const [metadata, setMetadata] = useState(state.metadata);

  const validateStep = useCallback(() => {
    if (!state.selectedWorksheetName) {
      toast.error('You must select a worksheet');
      return false;
    }
    // validate required fields
    const requiredFields = uploadStepFields?.filter((fld) => fld.required);
    let isValid = true;
    let error = '';
    for (const field of requiredFields) {
      if (!state.metadata?.[field.key]) {
        if (field.errorMessage) {
          error = field.errorMessage;
        } else {
          error = `${field.label} is mandatory`;
        }
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      toast.error(`${error}`);
      setIsLoading(false);
      return;
    } else {
      setIsLoading(false);
    }
    return true;
  }, [state, uploadStepFields]);

  const handleOnContinue = useCallback(async () => {
    setIsLoading(true);
    if (!validateStep()) {
      setIsLoading(false);
      return;
    }
    await onContinue(state);
    setIsLoading(false);
  }, [onContinue, state, validateStep]);

  const handleOnSkipLaterSteps = useCallback(async () => {
    setIsLoading(true);
    if (!validateStep()) {
      setIsLoading(false);
      return;
    }
    await onSkipPostUploadSteps(state);
    setIsLoading(false);
  }, [onSkipPostUploadSteps, state, validateStep]);

  const handleChange = (
    key: string,
    // evt: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>
    value: any
  ) => {
    state.metadata = { ...state.metadata, [key]: value };
  };

  useEffect(() => {
    state.activeStep = StepType.upload;
  }, [state]);

  // useEffect(() => {
  //   setMetadata(state.metadata);
  // }, [state.metadata]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        flex: 1,
        // minWidth: 768,
        marginTop: 5,
        borderColor: '#e5e5e5',
        borderStyle: 'solid',
      }}
    >
      <Grid2 container spacing={2}>
        {/* <Grid2 md={6}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Expected Columns
          </Typography>
          <ExpectedColumns state={state} />
        </Grid2> */}
        <Grid2 md={7}>
          <form noValidate autoComplete="off">
            {uploadStepFields?.map((el, idx) => {
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
                      value={state.metadata?.[el.key]}
                      onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(el.key, evt.target.value);
                        el.onChange?.(evt.target.value, state);
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <FormHelperText>{el.helperText}</FormHelperText>
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

                    <Box style={{ height: '200px' }}>
                      <ReactQuill
                        // value={richComments}
                        onChange={(val) => {
                          handleChange(el.key, val);
                          el.onChange?.(val, state);
                        }}
                        value={state.metadata?.[el.key]}
                        placeholder="Write your comments here..."
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
                            ['image' /*, 'link'*/, 'clean'],
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
                    <FormHelperText>{el.helperText}</FormHelperText>
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
                      value={state.metadata?.[el.key]}
                      label={el.label}
                      onChange={(evt: SelectChangeEvent) => {
                        handleChange(el.key, evt.target.value);
                        el.onChange?.(evt.target.value, state);
                      }}
                    >
                      {el.options?.map(
                        (opt: SelectFieldOption, idx: number) => (
                          <MenuItem key={idx} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <FormHelperText>{el.helperText}</FormHelperText>
                  </FormControlContainer>
                );
              }
              if (el.type === 'Checkbox') {
                return (
                  <FormControlContainer key={el.key}>
                    {/* <Box style={{ display: 'flex' }}>
                      <Typography variant="body1">{el.label}</Typography>
                      {el.required && (
                        <Typography
                          variant="body1"
                          style={{ color: 'red', marginLeft: 2 }}
                        >
                          *
                        </Typography>
                      )}
                    </Box> */}
                    <FormControlLabel
                      style={{
                        marginTop: 10,
                      }}
                      label={el.label}
                      control={
                        <Checkbox
                          // checked={termsChecked}
                          checked={state.metadata?.[el.key]}
                          onChange={(evt) => {
                            handleChange(el.key, evt.target.checked);
                            el.onChange?.(evt, state);
                          }}
                          // onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                          //   if (!state.preImportValues) {
                          //     state.preImportValues = { dataType: '', hasAgreedTerms: false };
                          //   }
                          //   state.preImportValues.hasAgreedTerms = evt.target.checked;
                          // }}
                        />
                      }
                    />
                    <FormHelperText>{el.helperText}</FormHelperText>
                  </FormControlContainer>
                );
              }
            })}
          </form>
        </Grid2>
        <Grid2 md={5}>
          <Grid2 md={12}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              Upload file
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
            ? 'Or Continue with column matching'
            : undefined
        }
        preContinueButton={
          allowSkipPostUploadStep ? (
            <Button
              disabled={isLoading}
              size="small"
              variant="contained"
              onClick={async () => {
                console.log('Pre continue clicked');
                await handleOnSkipLaterSteps();
              }}
            >
              Complete dataset upload
            </Button>
          ) : undefined
        }
      />
    </Box>
  );
};
