import React from 'react';
import { MatchColumns } from './components/MatchColumns';
import { MatchColumnItem } from './components/MatchColumnItem';
import { Box, Typography } from '@mui/material';
import { ImportStepProps } from '../../types';
import { NavigationPanel } from '../../components/NavigationPanel';

interface Props extends ImportStepProps {}

export const MatchColumnsStep = ({ state, onContinue, onBack }: Props) => {
  return (
    <>
      <Box
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyItems: 'center',
          flexDirection: 'column',
          marginTop: 10,
        }}
      >
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          Match Columns
        </Typography>
        <MatchColumns state={state} />
      </Box>
      <NavigationPanel onNext={() => onContinue(state)} onPrev={onBack} />
    </>
  );
};
