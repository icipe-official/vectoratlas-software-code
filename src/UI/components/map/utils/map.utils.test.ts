import { responseToGEOJSON, sleep } from './map.utils';

describe(responseToGEOJSON.name, () => {
  it('returns a string of a GEOJSON object when provided with a location response', () => {
    const testResponse = [
      {
        year_start: 27,
        site: {
          location: {
            type: 'Point',
            coordinates: [33.4571316, 2.365873924],
          },
          name: 'L1',
        },
        sample: {
          n_all: 42,
        },
        recorded_species: {
          species: {
            species: 'species test',
          },
        },
      },
      {
        year_start: 227,
        site: {
          location: {
            type: 'Point',
            coordinates: [38.81845929, 2.67319336],
          },
          name: 'L2',
        },
        sample: {
          n_all: 242,
        },
        recorded_species: {
          species: {
            species: 'species test 2',
          },
        },
      },
    ];

    const testResponseToGEOJSON = responseToGEOJSON(testResponse);
    const expectedGEOJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [33.4571316, 2.365873924],
          },
          properties: {
            name: 'L1',
            year_start: 27,
            n_all: 42,
            species: 'species test',
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [38.81845929, 2.67319336],
          },
          properties: {
            name: 'L2',
            year_start: 227,
            n_all: 242,
            species: 'species test 2',
          },
        },
      ],
    };
    expect(testResponseToGEOJSON).toEqual(JSON.stringify(expectedGEOJSON));
  });
  it('handles an empty response as argument', () => {
    const testResponse: any = [];
    const testResponseToGEOJSON = JSON.parse(responseToGEOJSON(testResponse));
    const expectedGEOJSON = {
      features: [],
      type: 'FeatureCollection',
    };
    expect(testResponseToGEOJSON).toEqual(expectedGEOJSON);
  });
});
describe(sleep.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  it('returns a promise that does not resolve until specified time passed', async () => {
    const spy = jest.fn();
    sleep(200).then(spy);

    jest.advanceTimersByTime(20);
    await Promise.resolve();
    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(180);
    await Promise.resolve();
    expect(spy).toHaveBeenCalled();
  });
});
