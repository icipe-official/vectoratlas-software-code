import React from 'react';
import { initialState } from '../../../state/mapSlice';
import { AppState } from '../../../state/store';
import { render } from '../../../test_config/render';
import { fireEvent, screen } from '@testing-library/dom';
import DrawerMap from './drawerMap';

describe(DrawerMap.name, () => {
  it('renders drawer', () => {
    const state: Partial<AppState> = {
      map: {
        ...initialState,
        map_overlays: [
          {
            name: 'an_gambiae',
            sourceLayer: 'overlays',
            sourceType: 'raster',
            isVisible: true,
          },
          {
            name: 'countries',
            sourceLayer: '',
            sourceType: 'vector',
            isVisible: true,
          },
          {
            name: 'lakes_reservoirs',
            sourceLayer: '',
            sourceType: 'vector',
            isVisible: true,
          },
          {
            name: 'land',
            sourceLayer: '',
            sourceType: 'vector',
            isVisible: true,
          },
          {
            name: 'oceans',
            sourceLayer: '',
            sourceType: 'vector',
            isVisible: true,
          },
          {
            name: 'rivers_lakes',
            sourceLayer: '',
            sourceType: 'vector',
            isVisible: true,
          },
        ],
      },
    };

    render(<DrawerMap />, state);

    expect(screen.getByTestId('drawer')).toBeVisible();
  });

  it('the state of the drawer can be toggled when menu button and chevron left are clicked', () => {
    let testState;
    testState = { map: JSON.parse(JSON.stringify(initialState)) };
    testState.map.map_drawer = { open: true, overlays: true, baseMap: true };

    const { store } = render(<DrawerMap />, testState);
    fireEvent.click(screen.getByTestId('drawerToggle'));

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({ type: 'map/drawerToggle' });
  });
});
