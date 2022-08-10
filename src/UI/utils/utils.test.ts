import * as utils from './utils';

describe('is_flag_on', () => {
  const feature_flags = [
    { flag: 'onflag', on: true },
    { flag: 'offflag', on: false }
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
})