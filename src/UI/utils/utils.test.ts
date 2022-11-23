import * as utils from './utils';

describe('is_flag_on', () => {
  const feature_flags = [
    { flag: 'onflag', on: true },
    { flag: 'offflag', on: false },
  ];

  it('returns true if flag is on', () => {
    expect(utils.is_flag_on(feature_flags, 'onflag')).toBe(true);
  });

  it('returns false if flag is off', () => {
    expect(utils.is_flag_on(feature_flags, 'offflag')).toBe(false);
  });

  it('returns false if flag is missing', () => {
    expect(utils.is_flag_on(feature_flags, 'missingflag')).toBe(false);
  });
});

describe(utils.convertToCSV.name, () => {
  const testArray = [
    { test1: 'test1', test2: true, test3: 5 },
    { test4: '', test5: false, test6: 0.6 },
  ];
  it('returns csv string given an array', () => {
    expect(typeof utils.convertToCSV(testArray)).toEqual('string');
  });
});
