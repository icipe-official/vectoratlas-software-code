import React from 'react';
import { SelectHeader } from './SelectHeader';
import { ImportStepProps, ImportWizardState } from '../../../types';
import { NavigationPanel } from '../../../components/NavigationPanel';

export const SelectHeaderStep = ({
  state,
  onContinue,
  onBack,
}: ImportStepProps) => {
  return (
    <div>
      <SelectHeader state={state} />
      <NavigationPanel onNext={() => onContinue(state)} onPrev={onBack} />
    </div>
  );
};
