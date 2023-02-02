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
  dataType: string
):  { 'VA-column': string; 'Template-column': string }[] => {
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
}

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
}
