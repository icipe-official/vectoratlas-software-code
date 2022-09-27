import React from 'react';
import { MapWrapper } from './map';
import {render} from '../../test_config/render';
import { initialState } from '../../state/mapSlice';
import { AppState } from '../../state/store';
import {unpackOverlays} from './map.utils';

jest.mock('ol/Map',()=>jest.fn().mockReturnValue({
  setTarget:jest.fn(),
  on:jest.fn()
}) );
jest.mock('ol/View',()=>jest.fn() );
jest.mock('ol/layer/VectorTile',()=>jest.fn() );
jest.mock('ol/source/VectorTile',()=>jest.fn() );
jest.mock('ol/source/XYZ',()=>jest.fn() );
jest.mock('ol/layer/Tile',()=>jest.fn().mockReturnValue({
  setOpacity:jest.fn()
}) );
jest.mock('ol/format/MVT',()=>jest.fn());
jest.mock('ol/proj',()=>({
  transform:() => ({})
}));
jest.mock('ol/style',()=>({
  Style:jest.fn(),
  Fill:jest.fn(),
  Stroke:jest.fn()
}));

describe(MapWrapper.name, () => {
  it('renders the map wrapper', () => {
    const state: Partial<AppState> = {
      map:{ ...initialState, map_overlays: [
        {
          name:'an_gambiae',
          sourceLayer:'overlays',
          sourceType:'raster',
          overlays:[]
        },
        {
          name:'world',
          sourceLayer:'',
          sourceType:'vector',
          overlays:[
            {name:'countries'},
            {name:'lakes_reservoirs'},
            {name:'land'},
            {name:'oceans'},
            {name:'rivers_lakes'}
          ]
        }
      ]} };
    render(
      <MapWrapper/>, state);
  });
});

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

