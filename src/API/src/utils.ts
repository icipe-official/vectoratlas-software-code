export const isEmpty = (object) =>
  Object.values(object).every((x) => x === null || x === '' || x === undefined);

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
