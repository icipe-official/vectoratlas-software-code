export function errorMessageType(
  key: string,
  receivedType: string,
  expectedType: string,
  row: number,
) {
  return {
    row: row,
    key: key,
    errorType: 'Incorrect data type',
    expectedType: expectedType,
    receivedType
  }
}

export function errorMessageNullable(
  key: string,
  expectedType: string,
  row: number,
) {
  return {
  row: row,
  key: key,
  errorType: 'Required data',
  expectedType: expectedType,
  }
}
