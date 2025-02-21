import { Box, rgbToHex } from '@mui/material';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DatasetType, ImportStepProps } from '../../types';
import { NavigationPanel } from '../../components/NavigationPanel';
import { StepType } from '../../ImportWizard';
import { PreImportComponentRef } from '../../../data/UploadWizardForm';

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
    const rf = elementsRef.current?.[0]; // as React.RefObject<PreImportComponent>;
    const preValues = rf?.current?.getState().preImportValues; // get all preImport state values
    state.preImportValues = preValues;
    state.dataType = preValues?.['dataType'] || DatasetType.Occurrence;
    setIsLoading(true);
    await onContinue(state);
    setIsLoading(false);
  }, [onContinue, state]);

  useEffect(() => {
    state.activeStep = StepType.preImport;
  }, [state]);

  const elementsRef = useRef(
    React.Children.map(children, (child, idx) =>
      createRef<PreImportComponentRef>()
    )
  );

  let childrenClone = React.Children.map(children, (child, idx) => {
    return React.cloneElement(child as React.ReactElement<any>, {
      ref: elementsRef.current?.[idx],
    });
  });

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
      {/* {children} */}
      {childrenClone}
      <NavigationPanel
        isLoading={isLoading}
        onNext={() => handleOnContinue()}
        onPrev={onBack}
        onSkip={onSkip}
      />
    </Box>
  );
};
