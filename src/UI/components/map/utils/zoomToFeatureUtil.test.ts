import {
  African_countries_extents,
  getCombinedExtent,
  matchObjectKeys,
} from './zoomToFeatureUtil';
import { countryList } from '../../../state/map/utils/countrySpeciesLists';
import { african_countries_extents } from '../utils/african_country_extents';

describe('getCombinedExtent function', () => {
  it('returns combined extent of given extents', () => {
    const extents = [
      [20, 30, 40, 50],
      [-10, 0, 10, 20],
      [30, 50, 60, 70],
    ];
    expect(getCombinedExtent(extents)).toEqual([-10, 0, 60, 70]);
  });

  it('returns combined extent of one extent', () => {
    const extents = [[20, 30, 40, 50]];
    expect(getCombinedExtent(extents)).toEqual([20, 30, 40, 50]);
  });
});

describe('matchObjectKeys function', () => {
  const africanCountries: African_countries_extents = {
    Congo: [11.0933523, -5.0401428, 18.6374527, 3.7249113],
    Algeria: [-12.2982004, 18.9609009, 11.9688997, 37.0983009],
    Angola: [11.6400003, -18.0165692, 24.0843033, -4.4380231],
    Nigeria: [2.6688991, 4.2633039, 14.6573002, 13.892992],
    // rest of the countries
  };

  it('returns matching extents when a search term matches a country', () => {
    const searchTerm = 'Algeria';
    const expected = [[-12.2982004, 18.9609009, 11.9688997, 37.0983009]];
    expect(matchObjectKeys([searchTerm], africanCountries)).toEqual(expected);
  });

  it('returns matching extents when multiple search terms match different countries', () => {
    const searchTerms = ['Congo', 'Nigeria'];
    const expected = [
      [11.0933523, -5.0401428, 18.6374527, 3.7249113],
      [2.6688991, 4.2633039, 14.6573002, 13.892992],
    ];
    expect(matchObjectKeys(searchTerms, africanCountries)).toEqual(expected);
  });
});
describe('matchCountries', () => {
  it('matches countries with the countriesExtents list', () => {
    const countries = countryList.map((country) =>
      country.toLowerCase().replace(/\s+/g, '')
    );
    const keys = Object.keys(african_countries_extents).map((key) => {
      return key.toLowerCase();
    });

    const matchedCountries = countries.filter((country) =>
      keys.includes(country)
    );

    expect(matchedCountries.length).toEqual(countryList.length);
  });

  it('each extent is a valid numerical array with 4 values', () => {
    const extentsArray = Object.values(african_countries_extents);
    for (var extent of extentsArray) {
      expect(extent.length).toBe(4);
      expect(extent.every((val) => typeof val === 'number')).toBe(true);
    }
  });

  it('maxX is larger than minX and maxY is larger than minY', () => {
    const extents = Object.values(african_countries_extents);
    for (var extent of extents) {
      expect(extent[2] > extent[0]).toBeTruthy();
      expect(extent[3] > extent[1]).toBeTruthy();
    }
  });
});

describe('africanCountriesExtents', () => {});
