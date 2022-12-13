export function errorMessage(
  key: string,
  receivedType: string,
  expectedType: string,
  row: number,
) {
  // eslint-disable-next-line max-len
  return `Ingest Type Error - Column: ${key}, Row: ${
    row + 1
  } - A data type of ${expectedType} was expected, but ${receivedType} was received`;
}
