import { queryFilterMapper } from './queryFilterMapper';

describe('queryFilterMapper', () => {
  it('maps a filter object as expected', () => {
    const testFilter: any = {
      extractValueString: { value: 'testString' },
      extractValueStringArray: { value: ['testString1', 'testString2'] },
      extractValueBool: { value: true },
      extractValueBoolArray: { value: [true, false] },
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
      startTimestamp: 1234,
      endTimestamp: 5678,
    };
    expect(queryFilterMapper(testFilter)).toEqual(expectTestReturn);
  });

  it('ignores properties with empty lists', () => {
    const testFilter = {
      nonEmptyList: { value: ['item1', 'item2'] },
      emptyList: { value: [] },
    };

    expect(queryFilterMapper(testFilter)).toEqual({
      nonEmptyList: ['item1', 'item2'],
    });
  });

  it('ignores areaCoordinates property', () => {
    const testFilter = {
      areaCoordinates: ['test'],
    };

    expect(queryFilterMapper(testFilter)).toEqual({});
  });
});
