export const isEmpty = (object) =>
  Object.values(object).every((x) => x === null || x === '' || x === undefined);
