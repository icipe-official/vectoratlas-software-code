import { Typography } from '@mui/material';
import React from 'react';
import { formatDate } from '../../utils/utils';

const DateRenderer = ({
  value,
  excludeTime,
  dateSeparator,
  timeSeparator,
}: {
  value: Date | string | Number;
  excludeTime?: boolean;
  dateSeparator?: string;
  timeSeparator?: string;
}) => {
  return (
    <Typography variant="caption">
      {formatDate(
        value,
        excludeTime || false,
        dateSeparator || '-',
        timeSeparator || ':'
      )}
    </Typography>
  );
};

export default DateRenderer;
