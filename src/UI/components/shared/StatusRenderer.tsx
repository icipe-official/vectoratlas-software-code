import { Box, FormLabel } from '@mui/material';
import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { getStatusIndicator } from '../../utils/utils';

interface IStatusRendererProps {
  label?: string;
  status: string;
  statusTitle?: string;
}

export const StatusRenderer = (props: IStatusRendererProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {props.label && (
        <FormLabel sx={{ marginLeft: 1, fontSize: 18, marginRight: 3, fontWeight: 'bold' }}>{props.label}</FormLabel>
      )}
      <CircleIcon
        sx={{ width: 10, height: 10 }}
        color={getStatusIndicator(props.status)}
      />
      {props.title && (
        <FormLabel sx={{ marginLeft: 1 }}>{props.title}</FormLabel>
      )}
    </Box>
  );
};
