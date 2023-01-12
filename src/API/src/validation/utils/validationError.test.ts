import {
    errorMessageCharLimit, errorMessageNullable, errorMessageType
  } from './validationError';
  
describe('errorMessageType', () => {
  it('outputs expected type error message given appropriate arguments', () => {
    let typeErrorTest = errorMessageType('1', 'testType', 'testType2', 2 );
    expect(typeErrorTest).toEqual('Ingest Type Error - Column: 1, Row: 3 - A data type of testType2 was expected, but testType was received');
  });
});
describe('errorMessageNullable', () => {
    it('outputs expected nullable error message given appropriate arguments', () => {
      let nullableErrorTest = errorMessageNullable('1', 'testType', 2 );
      expect(nullableErrorTest).toEqual('Required Field - Column: 1, Row: 3 - Expected Type: testType');
    });
  });
  describe('errorMessageCharLimit', () => {
    it('outputs expected char limit error message given appropriate arguments', () => {
      let charErrorTest = errorMessageCharLimit('1', 2, 3, 4 );
      expect(charErrorTest).toEqual('Character Limit Exceeded - Column: 1, Row: 5 - Expected: 2 - Received: 3');
    });
  });
  
  