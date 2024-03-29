import React from 'react';
import { fireEvent, render } from '../../../test_config/render';
import { LayerControl } from './layerControl';
import { screen } from '@testing-library/dom';
import { initialState, MapState } from '../../../state/map/mapSlice';

jest.mock('react-color', () => ({
  SketchPicker: () => <div>ColourPicker mock</div>,
}));

describe('LayerControl', () => {
  let state: MapState;
  beforeEach(() => {
    state = initialState();

    state.map_styles.layers = [
      {
        name: 'testOverlay',
        colorChange: 'fill',
        fillColor: [255, 0, 0, 1],
        strokeColor: [],
        strokeWidth: 1,
        zIndex: 1,
      },
    ];
  });

  it('renders a layer button with the correct name', () => {
    render(
      <LayerControl
        name="testOverlay"
        displayName="Test overlay"
        isVisible={true}
      />,
      {
        map: state,
      }
    );

    expect(screen.getByText('Test overlay')).toBeVisible();
  });

  it('dispatches the correct action when checkbox is toggled', () => {
    const { store } = render(
      <LayerControl
        name="testOverlay"
        displayName="Test overlay"
        isVisible={true}
      />,
      {
        map: state,
      }
    );

    fireEvent.click(screen.getByText('Test overlay'));

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      payload: 'testOverlay',
      type: 'map/layerToggle',
    });
  });
});
