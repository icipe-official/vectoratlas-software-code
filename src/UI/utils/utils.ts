import React from 'react';
import { OverridableStringUnion } from '@mui/types';

export const is_flag_on = (
  feature_flags: { flag: string; on: boolean }[],
  name: string
) => {
  return feature_flags.some((x) => x.flag === name && x.on);
};

export function convertToCSV(headers: string, csvData: string[]) {
  return [headers, ...csvData].join('\n');
}

export const sanitiseDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};
export const getStatusIndicator = (
  status: string
): OverridableStringUnion<
  | 'inherit'
  | 'action'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
> => {
  let color: OverridableStringUnion<
    | 'inherit'
    | 'action'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
  > = 'info'; // Default value

  switch (status) {
    case 'Pending':
      color = 'warning';
      break;
    case 'Approved':
    case 'Sent':
      color = 'success';
      break;
    case 'Under Review':
      color = 'action';
      break;
    case 'Rejected':
    case 'Failed':
      color = 'error';
      break;
    case 'Rejected By Reviewer Manager':
      color = 'error';
      break;
    default:
      break;
  }

  return color;
};

export const createDynamicComponent = (
  component: React.ComponentType<any>,
  props: any
) => {
  return React.createElement(component, props);
};

export const isValidDate = (date: any) => {
  var timestamp = Date.parse(date);
  if (isNaN(timestamp)) {
    const dt = new Date(Number(date));
    timestamp = Date.parse(dt.valueOf().toString());
  }
  return isNaN(timestamp) == false ? timestamp : null;
};

export const formatDate = (
  date: Date | string | Number,
  // excludeSeparator: boolean = false,
  excludeTime: boolean = false,
  dateSeparator: string = '-',
  timeSeparator: string = ':'
) => {
  const validDate = isValidDate(date);
  if (!validDate) {
    return '';
  }
  date = new Date(validDate);
  const y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDay() + 1).padStart(2, '0');
  let h = '',
    m = '',
    s = '',
    ms = '';
  if (!excludeTime) {
    h = String(date.getHours() + 1).padStart(2, '0');
    m = String(date.getMinutes() + 1).padStart(2, '0');
    s = String(date.getSeconds() + 1).padStart(2, '0');
    ms = String(date.getMilliseconds() + 1).padStart(3, '0');
  }
  const dateSep = dateSeparator;
  const timeSep = excludeTime ? '' : timeSeparator;

  return `${y}${dateSep}${M}${dateSep}${d} ${h}${timeSep}${m}${timeSep}${s}${timeSep}${ms}`;
};
