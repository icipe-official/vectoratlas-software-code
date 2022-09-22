import React from 'react';
import { MapWrapper } from './map';
import {render} from '../../test_config/render';
import { initialState } from '../../state/mapSlice';
import { AppState } from '../../state/store';

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
