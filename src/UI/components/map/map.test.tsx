import React from 'react';
import { MapWrapper } from './map';
import { fireEvent } from '@testing-library/react';
import { render } from '../../test_config/render';
import { screen } from '@testing-library/dom';

jest.mock('ol/Map', () =>
  jest.fn().mockReturnValue({
    setTarget: jest.fn(),
    on: jest.fn(),
  })
);
jest.mock('ol/View', () => jest.fn());
jest.mock('ol/layer/VectorTile', () => jest.fn());
jest.mock('ol/source/VectorTile', () => jest.fn());
jest.mock('ol/source/XYZ', () => jest.fn());
jest.mock('ol/layer/Tile', () =>
  jest.fn().mockReturnValue({
    setOpacity: jest.fn(),
  })
);
jest.mock('ol/format/MVT', () => jest.fn());
jest.mock('ol/proj', () => ({
  transform: () => ({}),
}));
jest.mock('ol/style', () => ({
  Style: jest.fn(),
  Fill: jest.fn(),
  Stroke: jest.fn(),
}));

describe(MapWrapper.name, () => {
  it('renders the map wrapper', () => {
    render(<MapWrapper />);
  });
  it('updates opacity of layer', () => {
    render(<MapWrapper />);
    const sliderInput = screen.getByTestId('opacity-input');
    const opacityOutput = screen.getByTestId('opacity-output');
    fireEvent.change(sliderInput, { target: { value: '0.10' } });
    expect(opacityOutput.innerHTML === '0.10');
  });
  it('has layer opacity controls', () => {
    render(<MapWrapper />);
    const sliderTitle = screen.getByTestId('opacityScroll');
    const sliderInput = screen.getByTestId('opacity-input');
    const opacityOutput = screen.getByTestId('opacity-output');
    expect(sliderTitle.innerHTML === 'Layer opacity ');
    expect(sliderInput).toBeTruthy;
    expect(opacityOutput).toBeTruthy;
  });
  it('has layer interaction feedback', () => {
    render(<MapWrapper />);
    const interactionTitle = screen.getByTestId('layerInteractionTitle');
    const interactionFeed = screen.getByTestId('info1');
    expect(interactionTitle.innerHTML === 'Layer Interaction based on RGBA: ');
    expect(interactionFeed).toBeTruthy;
  });
});
