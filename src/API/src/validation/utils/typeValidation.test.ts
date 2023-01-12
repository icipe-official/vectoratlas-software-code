import {
    isBool, isNumber
  } from './typeValidation';
  
describe('isBool', () => {
  it('returns true if input is string including either true or false', () => {
    let bool = isBool('true')
    let bool2 = isBool('false')
    let number = isBool('2')
    let string = isBool('test')
    expect(bool).toEqual(true);
    expect(bool2).toEqual(true);
    expect(number).toEqual(false);
    expect(string).toEqual(false);
  });
});
describe('isNumber', () => {
    it('returns true if string includes numbers (floats, ints, scientifc)', () => {
      let int = isNumber('123' );
      let float = isNumber('123.456' );
      let sci1 = isNumber('1e2' );
      let sci2 = isNumber('1e+2' );
      let sci3 = isNumber('1e-2' );
      let bool = isNumber('true')
      let string = isNumber('test')
      expect(int).toEqual(true);
      expect(float).toEqual(true);
      expect(sci1).toEqual(true);
      expect(sci2).toEqual(true);
      expect(sci3).toEqual(true);
      expect(bool).toEqual(false);
      expect(string).toEqual(false);
    });
  });
//   describe('isValidDate', () => {
//     it('returns true if date between 1980 and present', () => {
//     });
//   });
  
  