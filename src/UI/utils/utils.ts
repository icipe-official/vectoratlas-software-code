import React from 'react';

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

export const getStatusIndicator = (status: string): string => {
  let color = 'info'; // '#d9182e';
  switch (status) {
    case 'Pending':
      color = 'warning'; // '#d9182e';
      break;
    case 'Approved':
    case 'Sent':
      color = 'success'; // '#4caf50';
      break;

    case 'Under Review':
      color = 'action'; // '#ffa500';
      break;

    case 'Rejected':
    case 'Failed':
      color = 'error'; // '#d9182e';
      break;
    case 'Rejected By Reviewer Manager':
      color = 'error'; // '#d9182e';
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
