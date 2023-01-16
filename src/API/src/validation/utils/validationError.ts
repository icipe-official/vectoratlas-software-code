export function errorMessageType(
  key: string,
  receivedType: string,
  expectedType: string,
  row: number,
) {
  return `Ingest Type Error - Column: ${key}, Row: ${
    row + 1
  } - A data type of ${expectedType} was expected, but ${receivedType} was received`;
}

export function errorMessageNullable(
  key: string,
  expectedType: string,
  row: number,
) {
  return `Required Field - Column: ${key}, Row: ${
    row + 1
  } - Expected Type: ${expectedType}`;
}
