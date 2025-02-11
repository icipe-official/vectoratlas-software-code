import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ImportProcessFlow } from './ImportProcessFlow';
import { ImportStepIndex, ImportWizardState } from './types';
import { useSpreadsheetImporter } from './hooks/useSpreadsheetImporter';

export enum StepType {
  preImport = 'PreImport',
  upload = 'upload',
  selectSheet = 'selectSheet',
  selectHeader = 'selectHeader',
  matchColumns = 'matchColumns',
  validateData = 'validateData',
  metaData = 'metaData',
}

const initialState: ImportWizardState = {
  dataType: 'Occurrence',
  stepIndex: ImportStepIndex.Upload,
  activeStep: StepType.upload,
  rawDataFile: null,
  validatedDataFile: null,
  // targetFields: [],
  rawRecords: [],
  rawColumns: [],
  transformedData: [],
  selectedWorksheetName: undefined,
  headers: [],
  workbook: undefined,
  columnMap: [],
  fileName: undefined,
  loading: false,
  templateList: [],
  metadata: {},
};

interface ImportWizardProps {
  preImportLabel?: string;
}

export const ImportWizard = (props: ImportWizardProps) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const { metadataFields, preImportComponent, optionalSteps } =
    useSpreadsheetImporter();
  const [skipped, setSkipped] = useState(new Set<number>());
  if (preImportComponent) {
    initialState.stepIndex = ImportStepIndex.PreImport;
  }
  const [state, setState] = React.useState<ImportWizardState>(initialState);

  const isStepOptional = () => {
    return optionalSteps?.includes(state.activeStep);
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = (state: ImportWizardState) => {
    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setSkipped(newSkipped);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setState((prevState) => {
      return { ...prevState, ...state, stepIndex: prevState.stepIndex + 1 };
    });
  };

  const handleSkip = () => {
    if (!isStepOptional()) {
      throw new Error('You cannot skip this step since it is not optional');
    }
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
    // setState((prevState) => {
    //   return { ...prevState, ...state, stepIndex: prevState.stepIndex + 1 };
    // });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setState((prevState) => {
      return { ...prevState, stepIndex: prevState.stepIndex - 1 };
    });
  };

  const handleUpdateState = (state: ImportWizardState) => {
    setState((prevState) => {
      return { ...prevState, ...state };
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setState((prevState) => {
      return { ...prevState, stepIndex: 0, activeStep: StepType.upload };
    });
  };

  const stepsLabels = [
    props.preImportLabel ? props.preImportLabel : 'Preparation',
    'Upload File',
    'Select Headers',
    'Match Columns',
    'Validate Data',
    'Meta Data',
  ];

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {preImportComponent && (
          <Step key={0}>
            <StepLabel>{stepsLabels[0]}</StepLabel>
          </Step>
        )}
        <Step key={1}>
          <StepLabel>{stepsLabels[1]}</StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel>{stepsLabels[2]}</StepLabel>
        </Step>
        <Step key={3}>
          <StepLabel>{stepsLabels[3]}</StepLabel>
        </Step>
        <Step key={4}>
          <StepLabel>{stepsLabels[4]}</StepLabel>
        </Step>
        {metadataFields && (
          <Step key={5}>
            <StepLabel>{stepsLabels[5]}</StepLabel>
          </Step>
        )}
      </Stepper>

      <ImportProcessFlow
        state={state}
        onNext={handleNext}
        onPrev={handleBack}
        onSkip={handleSkip}
        updateState={handleUpdateState}
      />
    </>
  );
};
