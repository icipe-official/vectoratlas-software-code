import * as formValidation from './sourceStringValidation';

describe('sourceStringValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testSourceStringObject: any = {
    test1: 'This is a test string',
    test2: 'Thi\\s i\\s a t\\est str\\ing',
    test3: '\\This is\\ a \\test string\\',
    test4: 'Th"i"s is a t"e"st s"trin"g',
    test5: '"This" is "a" test "string"',
  };

  const testSourceStringObjectExpected: any = {
    test1: 'This%20is%20a%20test%20string',
    test2: 'Thi%5Cs%20i%5Cs%20a%20t%5Cest%20str%5Cing',
    test3: '%5CThis%20is%5C%20a%20%5Ctest%20string%5C',
    test4: 'Th%22i%22s%20is%20a%20t%22e%22st%20s%22trin%22g',
    test5: '%22This%22%20is%20%22a%22%20test%20%22string%22',
  };

  it('call on escapeRegex when required to process string', () => {
    expect(
      formValidation.sourceStringValidation(testSourceStringObject)
    ).toEqual(testSourceStringObjectExpected);
  });
});
