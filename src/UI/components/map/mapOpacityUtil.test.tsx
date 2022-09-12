import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { getByTestId, screen } from '@testing-library/dom';
import {updateOpacity} from './mapOpacityUtil';
import {MapWrapper} from './map';

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

describe(updateOpacity.name, () => {
  it('updates opacity of layer', () => {
    render(<MapWrapper/>);
    let sliderInput = screen.getByTestId('opacity-input');
    let opacityOutput = screen.getByTestId('opacity-output');
    fireEvent.change( sliderInput,{target:{value:'0.10'}}); 
    expect(opacityOutput.innerHTML === '0.10');
  });
});
