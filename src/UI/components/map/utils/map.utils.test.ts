import { responseToGEOJSON, sleep } from './map.utils';

describe(responseToGEOJSON.name, () => {
  it('returns a string of a GEOJSON object when provided with a location response', () => {
    const testResponse = [
      {
        location: {
          type: 'Point',
          coordinates: [33.4571316, 2.365873924],
        },
        species: 'species test',
      },
      {
        location: {
          type: 'Point',
          coordinates: [38.81845929, 2.67319336],
        },
        species: 'species test 2',
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
