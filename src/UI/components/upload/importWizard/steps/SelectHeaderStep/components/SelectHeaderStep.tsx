import React, { useCallback, useEffect, useState } from 'react';
import { SelectHeader } from './SelectHeader';
import { ImportStepProps, ImportWizardState } from '../../../types';
import { NavigationPanel } from '../../../components/NavigationPanel';
import { Backdrop, CircularProgress } from '@mui/material';
import LoadingMask from '../../../components/LoadingMask';
import { useSpreadsheetImporter } from '../../../hooks/useSpreadsheetImporter';
import { StepType } from '../../../ImportWizard';

export const SelectHeaderStep = ({
  state,
  onContinue,
  onBack,
  onSkip,
}: ImportStepProps) => {
  const [loading, setLoading] = useState(false);
  const { optionalSteps } = useSpreadsheetImporter();
  const isOptional = optionalSteps.includes(StepType.matchColumns);

  const handleOnContinue = useCallback(async () => {
    // set column map at this step
    setLoading(true);
    state.columnMap = [];
    state.rawColumns.map((el, idx) => {
      state.columnMap.push({ source: el, target: undefined });
    });
    await onContinue(state);
    setLoading(false);
  }, [onContinue, state]);

  useEffect(() => {
    state.activeStep = StepType.selectHeader;
  }, [state]);

  return (
    <div>
      <SelectHeader state={state} />
      <NavigationPanel
        onNext={handleOnContinue}
        onPrev={onBack}
        onSkip={onSkip}
        isLoading={loading}
        isOptional={isOptional}
      />
      <LoadingMask open={loading} />
    </div>
  );
};
