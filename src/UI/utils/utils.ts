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
  timeSeparator: string = ':',
  excludeMilliseconds: boolean = false
) => {
  const validDate = isValidDate(date);
  if (!validDate) {
    return '';
  }
  date = new Date(validDate);
  const y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  let h = '',
    m = '',
    s = '',
    ms = '';
  const timeSep = excludeTime ? '' : timeSeparator;
  if (!excludeTime) {
    h = String(date.getHours()).padStart(2, '0');
    m = String(date.getMinutes()).padStart(2, '0');
    s = String(date.getSeconds()).padStart(2, '0');
    if (!excludeMilliseconds)
      ms = `${timeSep}${String(date.getMilliseconds()).padStart(3, '0')}`;
  }
  const dateSep = dateSeparator;

  return `${y}${dateSep}${M}${dateSep}${d} ${h}${timeSep}${m}${timeSep}${s}${ms}`;
};

export const extractFileNameFromBlobUrl = (blobUrl: string): string => {
  // urls come in the form of https://vectoratlas.blob.core.windows.net/vectoratlas-container-test/raw/demo_data_no_merged_cells-20250205191945748-2025020305221324.xlsx?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2050-12-14T15:10:26Z&st=2022-12-14T07:10:26Z&spr=https&sig=x14LR9kSro%2FTyAMhHaSsyWJlqjuQmrODr72F371fEPA%3D
  let parts = blobUrl.split('//'); //split by url scheme
  let res = blobUrl;
  if (parts.length > 1) {
    const fileParts = parts[1].split('/'); // split by /
    res = fileParts.slice(2).join('/');
    // res = fileName.split('?')[0];
  } else {
    // try split by /
    parts = blobUrl.split('/');
    return parts.pop() || parts[0];
  }
  return res.split('?')[0];
};
