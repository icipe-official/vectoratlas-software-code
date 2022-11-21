import { escapeRegex, sourceStringValidation } from './sourceStringValidation';

describe('sourceStringValidation', () => {
  it('adds escape characters where appropriate', () => {
    const testStringNone: string = 'This is a test string';
    // eslint-disable-next-line prettier/prettier
    const testStringBackslashEmbedded: string = 'Thi\\s i\\s a t\\est str\\ing';
    const testStringBackslashEdge: string = '\\This is\\ a \\test string\\';
    const testStringDoubleQuotesEmbedded: string =
      'Th"i"s is a t"e"st s"trin"g';
    const testStringDoubleQuotesEdge: string = '"This" is "a" test "string"';
    expect(escapeRegex(testStringNone)).toEqual('This is a test string');
    // eslint-disable-next-line prettier/prettier
    expect(escapeRegex(testStringBackslashEmbedded)).toEqual('Thi\\\\s i\\\\s a t\\\\est str\\\\ing');
    // eslint-disable-next-line prettier/prettier
    expect(escapeRegex(testStringBackslashEdge)).toEqual('\\\\This is\\\\ a \\\\test string\\\\');
    // eslint-disable-next-line prettier/prettier
    expect(escapeRegex(testStringDoubleQuotesEmbedded)).toEqual('Th\\\"i\\\"s is a t\\\"e\\\"st s\\\"trin\\\"g');
    // eslint-disable-next-line prettier/prettier
    expect(escapeRegex(testStringDoubleQuotesEdge)).toEqual('\\\"This\\\" is \\\"a\\\" test \\\"string\\\"');
  });
});
