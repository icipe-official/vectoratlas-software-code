import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { ImportStepProps } from '../../types';
import { NavigationPanel } from '../../components/NavigationPanel';
import { StepType } from '../../ImportWizard';

interface Props extends ImportStepProps {
  children: React.ReactNode;
}

export const PreImportStep = ({
  state,
  children,
  onContinue,
  onBack,
  onSkip,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleOnContinue = useCallback(async () => {
    setIsLoading(true);
    await onContinue(state);
    setIsLoading(false);
  }, [onContinue, state]);

  useEffect(() => {
    state.activeStep = StepType.preImport;
  }, [state]);

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
      {children}
      <NavigationPanel
        isLoading={isLoading}
        onNext={() => handleOnContinue()}
        onPrev={onBack}
        onSkip={onSkip}
      />
    </Box>
  );
};
