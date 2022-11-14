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
}
