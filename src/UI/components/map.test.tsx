import React from 'react';
import { MapWrapper } from './map';
import {render} from '../test_config/render';
import Map from 'ol/Map';
import View from 'ol/View';

jest.mock('ol/Map',()=>jest.fn().mockReturnValue({setTarget:jest.fn()}) );
jest.mock('ol/View',()=>jest.fn() );
jest.mock('ol/layer/VectorTile',()=>jest.fn() );
jest.mock('ol/source/VectorTile',()=>jest.fn() );
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
    render(
      <MapWrapper />
    );
  });
});

// Test defaultStyle
//