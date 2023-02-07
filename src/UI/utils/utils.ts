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
