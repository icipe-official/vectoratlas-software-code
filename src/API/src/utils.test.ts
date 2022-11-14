import { isEmpty, makeDate } from './utils';

describe('isEmpty', () => {
  it('returns false for non-empty object', () => {
    expect(isEmpty({ id: 1 })).toBe(false);
  });

  it('returns false for non-empty object with empty values', () => {
    expect(isEmpty({ id: 1, id2: null })).toBe(false);
  });

  it('returns true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('returns true for non-empty object with null value', () => {
    expect(isEmpty({ id: null })).toBe(true);
  });

  it('returns true for non-empty object with undefined value', () => {
    expect(isEmpty({ id: undefined })).toBe(true);
  });

  it('returns true for non-empty object with empty value', () => {
    expect(isEmpty({ id: '' })).toBe(true);
  });

  it('returns true for non-empty object with multiple empty values', () => {
    expect(isEmpty({ id: '', id1: null, id2: undefined })).toBe(true);
  });
});

describe('makeDate', () => {
  it('returns null if year is null', () => {
    expect(makeDate(null, null)).toBeNull();
    expect(makeDate(null, 2)).toBeNull();
  });

  it('returns date if year is not null and month is null', () => {
    expect(makeDate(1990, null).getFullYear()).toBe(1990);
  });

  it('returns date if year is not null and month is not null', () => {
    expect(makeDate(1990, 2).getFullYear()).toBe(1990);
    expect(makeDate(1990, 2).getMonth()).toBe(2);
  });
})
