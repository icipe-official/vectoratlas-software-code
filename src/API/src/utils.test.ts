import * as fs from 'fs';
import { getMappingConfig, isEmpty, makeDate, mapValidationIssues, transformHeaderRow } from './utils';

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(`[
    {"VA-column": "Country", "Template-column": "Country of origin"},
    {"VA-column": "Author", "Template-column": "Paper author"},
    {"VA-column": "Full Name", "Template-column": "Name"}
  ]`)
}))

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
});

describe('getMappingConfig', () => {
  it('gets mapping config', () => {
    process.cwd = jest.fn().mockReturnValue('test')
    const config = getMappingConfig('source', 'type')
    expect(config).toEqual([
      {"VA-column": "Country", "Template-column": "Country of origin"},
      {"VA-column": "Author", "Template-column": "Paper author"},
      {"VA-column": "Full Name", "Template-column": "Name"}
    ])
    expect(fs.readFileSync).toHaveBeenCalledWith("test/public/templates/source/type-mapping.json",
      {"encoding": "utf8", "flag": "r"})
  });
});

describe('transformHeaderRow', () => {
  it('transforms header row', () => {
    const csv = `ENL_ID,Initials,Paper author,Year,Report Type,Published,V Data,Country of origin,Name
    405,J D,Charlwood,1997,report,no,yes,29434,,Kasim el Girba`
    const transformedCsv = transformHeaderRow(csv, 'source', 'type');
    expect(transformedCsv).toEqual(`ENL_ID,Initials,Author,Year,Report Type,Published,V Data,Country,Full Name
    405,J D,Charlwood,1997,report,no,yes,29434,,Kasim el Girba`)
  });
});

describe('mapValidationIssues', () => {
  it('maps validaiton issues', () => {
    const issues = [["Issue with Country", "Issue with Full Name"], ["Issue with Latitude"]]
    const transformedIssues = mapValidationIssues('source', 'type', issues);
    expect(transformedIssues).toEqual([["Issue with Country of origin", "Issue with Name"], ["Issue with Latitude"]])
  });
});
