import {unpackOverlays} from './unpackOverlays';

describe(unpackOverlays.name, () => {
  it('produces an array of additional overlays', () => {
    const test_overlays = [
      {
        name:'an_gambiae',
        sourceLayer:'overlays',
        sourceType:'raster'
      },
      {
        name:'world',
        sourceType:'vector',
        overlays:[
          {name:'countries'},
          {name:'lakes_reservoirs'},
          {name:'land'},
          {name:'oceans'},
          {name:'rivers_lakes'}
        ]
      }
    ];
    const unpackedOverlays = unpackOverlays(test_overlays)[0];
    const overlays:any = unpackedOverlays.find( l => l.sourceLayer === 'overlays');
    const numOverlays = (typeof overlays === 'object' ? 0 : (overlays.length));
    expect(unpackedOverlays.length === numOverlays);
  });
  it('produces an array of base map overlays', () => {
    const test_overlays = [
      {
        name:'an_gambiae',
        sourceLayer:'overlays',
        sourceType:'raster'
      },
      {
        name:'world',
        sourceType:'vector',
        overlays:[
          {name:'countries'},
          {name:'lakes_reservoirs'},
          {name:'land'},
          {name:'oceans'},
          {name:'rivers_lakes'}
        ]
      }
    ];
    const unpackedOverlays = unpackOverlays(test_overlays)[1];
    console.log(unpackedOverlays);
    const overlays:any = unpackedOverlays.find( l => l.sourceLayer === 'world');
    const numOverlays = overlays.length;
    expect(unpackedOverlays.length === numOverlays);
  });
  it('handles empty argument correctly', () => {
    const unpackedOverlays = unpackOverlays([]);
    expect(unpackedOverlays !== (null || undefined));
  });
});
