import {
  AppBar,
  Box,
  Divider,
  IconButton,
  List,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import Button from '@mui/material/Button';

interface Props {
  isLoading?: boolean;
  isLastStep?: boolean;
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  isOptional?: boolean;
  prevLabel?: string;
  continueLabel?: string;
  preContinueButton?: React.ReactNode;
}

export const NavigationPanel = ({
  isLoading,
  isLastStep,
  onNext,
  onPrev,
  onSkip,
  isOptional,
  prevLabel,
  continueLabel,
  preContinueButton,
}: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <AppBar position="static"> */}
      <Toolbar>
        <Button
          disabled={isLoading}
          style={{
            display: 'block',
            visibility: onPrev ? 'visible' : 'hidden',
          }}
          size="medium"
          onClick={onPrev}
        >
          {prevLabel || 'Back'}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
          {isOptional && (
            <Button color="inherit" onClick={onSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}
          {preContinueButton}
          <Button
            disabled={isLoading}
            size="small"
            variant="contained"
            onClick={onNext}
          >
            {isLastStep ? 'Finish' : continueLabel || 'Continue'}
          </Button>
        </Box>
      </Toolbar>
      {/* </AppBar> */}
    </Box>
  );
};

{
  /* <React.Fragment>
  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
    <Button
      color="inherit"
      disabled={activeStep === 0}
      onClick={handleBack}
      sx={{ mr: 1 }}
    >
      Back
    </Button>
    <Box sx={{ flex: '1 1 auto' }} />
    {isOptional && (
      <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
        Skip
      </Button>
    )}
    <Button onClick={handleNext}>
      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
    </Button>
  </Box>
</React.Fragment>; */
}
