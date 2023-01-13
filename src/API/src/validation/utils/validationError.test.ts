import { errorMessageNullable, errorMessageType } from './validationError';

describe('errorMessageType', () => {
  it('outputs expected type error message given appropriate arguments', () => {
    const typeErrorTest = errorMessageType('1', 'testType', 'testType2', 2);
    expect(typeErrorTest).toEqual(
      'Ingest Type Error - Column: 1, Row: 3 - A data type of testType2 was expected, but testType was received',
    );
  });
});
describe('errorMessageNullable', () => {
  it('outputs expected nullable error message given appropriate arguments', () => {
    const nullableErrorTest = errorMessageNullable('1', 'testType', 2);
    expect(nullableErrorTest).toEqual(
      'Required Field - Column: 1, Row: 3 - Expected Type: testType',
    );
  });
});
