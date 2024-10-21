import { Box, FormLabel } from '@mui/material';
import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { getStatusIndicator } from '../../utils/utils';

interface IStatusRendererProps {
  status: string;
  title?: string;
}

export const StatusRenderer = (props: IStatusRendererProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
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
