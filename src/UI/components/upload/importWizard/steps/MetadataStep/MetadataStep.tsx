import React, { useCallback, useEffect, useState } from 'react';
import { ImportStepProps, SelectFieldOption } from '../../types';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { NavigationPanel } from '../../components/NavigationPanel';
import { useSpreadsheetImporter } from '../../hooks/useSpreadsheetImporter';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { StepType } from '../../ImportWizard';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props extends ImportStepProps {}

interface InputControlProps {
  children: React.ReactNode;
}

const FormControlContainer = ({ children }: InputControlProps) => {
  return (
    <FormControl style={{ width: '90%', padding: 10 }}>{children}</FormControl>
  );
};

export const MetadataStep = ({ state, onContinue, onBack, onSkip }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { metadataFields } = useSpreadsheetImporter();
  const [metadata, setMetadata] = useState(state.metadata);

  const handleOnContinue = useCallback(async () => {
    setIsLoading(true);
    // validate required fields
    const requiredFields = metadataFields?.filter((fld) => fld.required);
    let isValid = true;
    let currFieldLabel: string | React.ReactNode = '';
    for (const field of requiredFields) {
      if (!state.metadata?.[field.key]) {
        currFieldLabel = field.label;
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      toast.error(`${currFieldLabel} is mandatory`);
      setIsLoading(false);
      return;
    } else {
      await onContinue(state);
      setIsLoading(false);
    }
  }, [metadataFields, onContinue, state]);

  useEffect(() => {
    setMetadata(state.metadata);
  }, [state.metadata]);

  useEffect(() => {
    state.activeStep = StepType.metaData;
  }, [state]);

  const handleChange = (
    key: string,
    // evt: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>
    value: any
  ) => {
    state.metadata = { ...state.metadata, [key]: value };
  };

  return (
    <>
      <form noValidate autoComplete="off">
        {metadataFields?.map((el, idx) => {
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
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(el.key, evt.target.value)
                  }
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
                    onChange={(val) => handleChange(el.key, val)}
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
                  label={el.label}
                  onChange={(evt: SelectChangeEvent) =>
                    handleChange(el.key, evt.target.value)
                  }
                >
                  {el.options?.map((opt: SelectFieldOption, idx: number) => (
                    <MenuItem key={idx} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{el.helperText}</FormHelperText>
              </FormControlContainer>
            );
          }
        })}
      </form>
      <NavigationPanel
        isLastStep
        isLoading={isLoading}
        onNext={() => handleOnContinue()}
        onPrev={onBack}
        onSkip={onSkip}
      />
    </>
  );
};
