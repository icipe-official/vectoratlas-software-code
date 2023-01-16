import { isBool, isNumber } from './typeValidation';

describe('isBool', () => {
  it('returns true if input is string including either true or false', () => {
    const bool = isBool('true');
    const bool2 = isBool('false');
    const bool3 = isBool('yes');
    const bool4 = isBool('no');
    const number = isBool('2');
    const string = isBool('test');
    expect(bool).toEqual(true);
    expect(bool2).toEqual(true);
    expect(bool3).toEqual(true);
    expect(bool4).toEqual(true);
    expect(number).toEqual(false);
    expect(string).toEqual(false);
  });
});
describe('isNumber', () => {
  it('returns true if string includes numbers (floats, ints, scientifc)', () => {
    const int = isNumber('123');
    const float1 = isNumber('123.456');
    const float2 = isNumber('.5');
    const sci1 = isNumber('1e2');
    const sci2 = isNumber('1e+2');
    const sci3 = isNumber('1e-2');
    const bool = isNumber('true');
    const string = isNumber('test');
    expect(int).toEqual(true);
    expect(float1).toEqual(true);
    expect(float2).toEqual(true);
    expect(sci1).toEqual(true);
    expect(sci2).toEqual(true);
    expect(sci3).toEqual(true);
    expect(bool).toEqual(false);
    expect(string).toEqual(false);
  });
});
