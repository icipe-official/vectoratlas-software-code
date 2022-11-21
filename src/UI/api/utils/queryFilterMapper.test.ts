import { queryFilterMapper } from './queryFilterMapper';

describe(queryFilterMapper.name, () => {
  it('maps a filter object as expected', () => {
    const testFilter: any = {
      extractValueString: { value: 'testString' },
      extractValueStringArray: { value: ['testString1', 'testString2'] },
      extractValueBool: { value: true },
      extractValueBoolArray: { value: [true, false] },
      emptyToNull: { value: 'empty' },
      timeRange: {
        value: {
          start: 1234,
          end: 5678,
        },
      },
    };
    const expectTestReturn: any = {
      extractValueString: 'testString',
      extractValueStringArray: ['testString1', 'testString2'],
      extractValueBool: true,
      extractValueBoolArray: [true, false],
      emptyToNull: null,
      startTimestamp: 1234,
      endTimestamp: 5678,
    };
    expect(queryFilterMapper(testFilter)).toEqual(expectTestReturn);
  });
});
