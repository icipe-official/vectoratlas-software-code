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
      color = 'success'; // '#4caf50';
      break;

    case 'Under Review':
      color = 'action'; // '#ffa500';
      break;

    case 'Rejected':
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
