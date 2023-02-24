import {
  African_countries_extents,
  getCombinedExtent,
  matchObjectKeys,
} from './zoomToFeatureUtil';
import { countryList } from '../../../state/map/utils/countrySpeciesLists';
import * as african_countries_extents_array from '../utils/african_country_extents.json';

describe('getCombinedExtent function', () => {
  test('returns combined extent of given extents', () => {
    const extents = [
      [20, 30, 40, 50],
      [-10, 0, 10, 20],
      [30, 50, 60, 70],
    ];
    expect(getCombinedExtent(extents)).toEqual([-10, 0, 60, 70]);
  });

  test('returns combined extent of one extent', () => {
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

  test('returns matching extents when a search term matches a country', () => {
    const searchTerm = 'Algeria';
    const expected = [[-12.2982004, 18.9609009, 11.9688997, 37.0983009]];
    expect(matchObjectKeys([searchTerm], africanCountries)).toEqual(expected);
  });

  test('returns matching extents when multiple search terms match different countries', () => {
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
    const african_countries_extents: African_countries_extents =
      african_countries_extents_array;
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
});
