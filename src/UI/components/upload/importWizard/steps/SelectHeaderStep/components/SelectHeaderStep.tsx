import React, { useCallback, useState } from 'react';
import { SelectHeader } from './SelectHeader';
import { ImportStepProps, ImportWizardState } from '../../../types';
import { NavigationPanel } from '../../../components/NavigationPanel';

export const SelectHeaderStep = ({
  state,
  onContinue,
  onBack,
}: ImportStepProps) => {
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <SelectHeader state={state} />
      <NavigationPanel
        onNext={handleOnContinue}
        onPrev={onBack}
        isLoading={loading}
      />
    </div>
  );
};
