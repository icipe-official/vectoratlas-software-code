import { unpackOverlays } from './mapSliceUtils';

describe(unpackOverlays.name, () => {
  let testOverlays: ({ name: string; sourceLayer: string; sourceType: string; overlays?: undefined; } | { name: string; sourceType: string; overlays: { name: string; }[]; sourceLayer?: undefined; })[];

  beforeEach(() => {
    testOverlays = [
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
          { name: 'land' },
          { name: 'oceans' },
          { name: 'rivers_lakes' },
        ],
      },
    ];
  })

  it('produces an array of additional overlays', () => {
    const overlays = unpackOverlays(testOverlays).filter(
      (l: any) => l.sourceLayer === 'overlays'
    );
    expect(overlays).toHaveLength(1);
  });

  it('produces an array of base map overlays', () => {
    const overlays = unpackOverlays(testOverlays).filter(
      (l: any) => l.sourceLayer === 'world'
    );
    expect(overlays).toHaveLength(4);
  });

  it('handles empty argument correctly', () => {
    const unpackedOverlays = unpackOverlays([]);
    expect(unpackedOverlays).toEqual([[], []]);
  });
});