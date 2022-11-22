import { sourceStringValidation } from './sourceStringValidation';

describe('sourceStringValidation', () => {
  const testSourceStringObject: any = {
    test1: 'This is a test string',
    test2: 'Thi\\s i\\s a t\\est str\\ing',
    test3: 'Thi\\s i\\s a t\\est str\\ing',
  };
  it('call on escapeRegex when required to process string', () => {
    jest.mock('./escapeRegex', () => ({
      escapeRegex: jest.fn(),
    }));
    sourceStringValidation(testSourceStringObject);
    expect(escapeRegex).toBeCalledTimes(2);
  });
});
