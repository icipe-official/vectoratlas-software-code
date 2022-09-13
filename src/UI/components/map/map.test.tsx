import React from 'react';
import { MapWrapper } from './map';
import { fireEvent } from '@testing-library/react';
import {render} from '../../test_config/render';
import { getByTestId, screen } from '@testing-library/dom';

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
    render(
      <MapWrapper/>);
  });
  it('updates opacity of layer', () => {
    render(
      <MapWrapper/>);
    let sliderInput = screen.getByTestId('opacity-input');
    let opacityOutput = screen.getByTestId('opacity-output');
    fireEvent.change( sliderInput,{target:{value:'0.10'}}); 
    expect(opacityOutput.innerHTML === '0.10');
  });
  it('returns evidence of interaction with layer', () => {
    render(
      <MapWrapper/>);
    // let ZoomIn = screen.getByTitle('Zoom in');
    // for (let i=0; i<6; i++){
    //   fireEvent.click(ZoomIn);
    // }
    let Map = screen.getByTestId('mapDiv');
    fireEvent.mouseOver(Map);
    let interactionReading = parseFloat(screen.getByTestId('info1').innerHTML);
    fireEvent.mouseOver(Map);
    console.log(interactionReading);
    expect(interactionReading).not.toEqual('0.00');
  });
});
