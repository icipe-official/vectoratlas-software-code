import { Box, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Grid2 from '@mui/material/Unstable_Grid2';
import ExpectedColumns from './components/ExpectedColumns';
import { DropZone } from './components/DropZone';
import SelectSheet from './components/SelectSheet';
import { ImportStepProps, ImportWizardState } from '../../types';
import { NavigationPanel } from '../../components/NavigationPanel';

interface Props extends ImportStepProps {
  onFileAccepted: (v: ImportWizardState) => Promise<void>;
}

export const UploadStep = ({
  state,
  onContinue,
  onBack,
  onFileAccepted,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleOnContinue = useCallback(async () => {
    setIsLoading(true);
    await onContinue(state);
    setIsLoading(false);
  }, [onContinue, state]);
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
        <Grid2 md={6}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Expected Columns
          </Typography>
          <ExpectedColumns state={state} />
        </Grid2>
        <Grid2 md={6}>
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
            <SelectSheet state={state} />
          </Grid2>
        </Grid2>
      </Grid2>
      <NavigationPanel
        isLoading={isLoading}
        onNext={() => handleOnContinue()}
        onPrev={onBack}
      />
    </Box>
  );
};
