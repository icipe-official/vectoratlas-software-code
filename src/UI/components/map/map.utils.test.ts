import { responseToGEOJSON } from './map.utils';

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
          },
        },
      ],
    };
    expect(testResponseToGEOJSON).toEqual(JSON.stringify(expectedGEOJSON));
  });
   it('handles an empty response as argument', () => {
    const testResponse = [];
    const testResponseToGEOJSON = responseToGEOJSON(testResponse);
    const expectedGEOJSON = {
      type: 'FeatureCollection',
      features: [],
    };
  });
});

import { unpackOverlays } from './map.utils';

describe(unpackOverlays.name, () => {
  it('produces an array of additional overlays', () => {
    const test_overlays = [
      {
        name: 'an_gambiae',
        sourceLayer: 'overlays',
        sourceType: 'raster',
      },
      {
        name: 'world',
        sourceType: 'vector',
        overlays: [
          { name: 'countries' },
          { name: 'lakes_reservoirs' },
          { name: 'land' },
          { name: 'oceans' },
          { name: 'rivers_lakes' },
        ],
      },
    ];
    const unpackedOverlays = unpackOverlays(test_overlays)[0];
    const overlays: any = unpackedOverlays.find(
      (l) => l.sourceLayer === 'overlays'
    );
    const numOverlays = typeof overlays === 'object' ? 0 : overlays.length;
    expect(unpackedOverlays.length === numOverlays);
  });
  it('produces an array of base map overlays', () => {
    const test_overlays = [
      {
        name: 'an_gambiae',
        sourceLayer: 'overlays',
        sourceType: 'raster',
      },
      {
        name: 'world',
        sourceType: 'vector',
        overlays: [
          { name: 'countries' },
          { name: 'lakes_reservoirs' },
          { name: 'land' },
          { name: 'oceans' },
          { name: 'rivers_lakes' },
        ],
      },
    ];
    const unpackedOverlays = unpackOverlays(test_overlays)[1];
    console.log(unpackedOverlays);
    const overlays: any = unpackedOverlays.find(
      (l) => l.sourceLayer === 'world'
    );
    const numOverlays = overlays.length;
    expect(unpackedOverlays.length === numOverlays);
  });
  it('handles empty argument correctly', () => {
    const unpackedOverlays = unpackOverlays([]);
    expect(unpackedOverlays !== (null || undefined));
  });
});
