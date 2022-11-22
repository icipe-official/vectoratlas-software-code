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
    test1: 'This is a test string',
    test2: 'Thi\\\\s i\\\\s a t\\\\est str\\\\ing',
    test3: '\\\\This is\\\\ a \\\\test string\\\\',
    // eslint-disable-next-line prettier/prettier
    test4: 'Th\\\"i\\\"s is a t\\\"e\\\"st s\\\"trin\\\"g',
    // eslint-disable-next-line prettier/prettier
    test5: '\\\"This\\\" is \\\"a\\\" test \\\"string\\\"',
  };

  it('call on escapeRegex when required to process string', () => {
    expect(
      formValidation.sourceStringValidation(testSourceStringObject)
    ).toEqual(testSourceStringObjectExpected);
  });
});
