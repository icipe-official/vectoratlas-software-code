import * as fs from 'fs';

export const isEmpty = (object) =>
  Object.values(object).every((x) => x === null || x === '' || x === undefined);

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export const makeDate = (year?: number, month?: number) => {
  if (month && year) {
    return new Date(year, month);
  } else if (year) {
    return new Date(year, 0);
  }
  return null;
};

export const getMappingConfig = (
  dataSource: string,
  dataType: string,
): { 'VA-column': string; 'Template-column': string }[] => {
  return JSON.parse(
    fs.readFileSync(
      process.cwd() +
        `/public/templates/${dataSource}/${dataType}-mapping.json`,
      {
        encoding: 'utf8',
        flag: 'r',
      },
    ),
  );
};

export const transformHeaderRow = (
  csvString: string,
  dataSource: string,
  dataType: string,
): string => {
  let headerRow = csvString.slice(0, csvString.indexOf('\n'));
  const mappingConfig = getMappingConfig(dataSource, dataType);
  mappingConfig.forEach((map) => {
    headerRow = headerRow.replace(
      `${map['Template-column']}`,
      `${map['VA-column']}`,
    );
  });
  return csvString.replace(
    csvString.slice(0, csvString.indexOf('\n')),
    headerRow,
  );
};

export const mapValidationIssues = (
  dataSource: string,
  dataType: string,
  validationIssuesArray: any[],
) => {
  const mappingConfig = getMappingConfig(dataSource, dataType);
  mappingConfig.forEach((config) => {
    validationIssuesArray.map((issue) => {
      issue.key = issue.key.replace(
        `${config['VA-column']}`,
        `${config['Template-column']}`,
      );
    });
  });
  return validationIssuesArray;
};

export const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDay() + 1).padStart(2, '0');
  const h = String(date.getHours() + 1).padStart(2, '0');
  const m = String(date.getMinutes() + 1).padStart(2, '0');
  const s = String(date.getSeconds() + 1).padStart(2, '0');
  const ms = date.getMilliseconds();
  return `${y}${M}${d}${h}${m}${s}${ms}`;
};
