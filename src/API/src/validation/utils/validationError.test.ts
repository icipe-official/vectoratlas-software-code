import { errorMessageNullable, errorMessageType } from './validationError';

describe('errorMessageType', () => {
  it('outputs expected type error message given appropriate arguments', () => {
    const typeErrorTest = errorMessageType('1', 'testType', 'testType2', 2);
    expect(typeErrorTest).toEqual(
      {"errorType": "Incorrect data type", "expectedType": "testType2", "key": "1", "receivedType": "testType", "row": 2},
    );
  });
});
describe('errorMessageNullable', () => {
  it('outputs expected nullable error message given appropriate arguments', () => {
    const nullableErrorTest = errorMessageNullable('1', 'testType', 2);
    expect(nullableErrorTest).toEqual(
      {"errorType": "Required data", "expectedType": "testType", "key": "1", "row": 2},
    );
  });
});
