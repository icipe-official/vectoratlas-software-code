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
}

export const NavigationPanel = ({
  isLoading,
  isLastStep,
  onNext,
  onPrev,
}: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <AppBar position="static"> */}
      <Toolbar>
        <Button
          // loading={isLoading}
          style={{
            display: 'block',
            visibility: onPrev ? 'visible' : 'hidden',
          }}
          size="medium"
          onClick={onPrev}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
          <Button
            // loading={isLoading}
            size="small"
            variant="contained"
            onClick={onNext}
          >
            {isLastStep ? 'Finish' : 'Continue'}
          </Button>
        </Box>
      </Toolbar>
      {/* </AppBar> */}
    </Box>
  );
};
