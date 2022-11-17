import { queryFilterMapper } from './queryFilterMapper';

describe(queryFilterMapper.name, () => {
  it('maps a filter object as expected', () => {
    const testFilter: any = {
      noChange: { value: 'testNoChange' },
      timeRange: {
        value: {
          start: 1234,
          end: 5678,
        },
      },
    };
    const expectTestReturn: any = {
      noChange: 'testNoChange',
      startTimestamp: 1234,
      endTimestamp: 5678,
    };
    expect(queryFilterMapper(testFilter)).toEqual(expectTestReturn);
  });
});
