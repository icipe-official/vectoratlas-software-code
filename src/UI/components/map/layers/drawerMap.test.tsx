import React from 'react';
import { initialState } from '../../../state/map/mapSlice';
import { AppState } from '../../../state/store';
import { render } from '../../../test_config/render';
import { fireEvent, screen } from '@testing-library/dom';
import DrawerMap from './drawerMap';

jest.mock('./filters/filterList', () => ({
  FilterList: (props) => <div>Filter list mock {JSON.stringify(props)}</div>,
}));

const buildOverlay = (name) => ({
  name,
  sourceLayer: '',
  sourceType: 'raster',
  isVisible: true,
});

describe('DrawerMap', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    state = { map: initialState() };
  });

  it('renders drawer', () => {
    state.map.map_overlays = [
      {
        ...buildOverlay('an_gambiae'),
        sourceLayer: 'overlays',
      },
      buildOverlay('countries'),
      buildOverlay('lakes_reservoirs'),
      buildOverlay('land'),
      buildOverlay('oceans'),
      buildOverlay('rivers_lakes'),
    ];

    render(<DrawerMap />, state);

    expect(screen.getByTestId('drawer')).toBeVisible();
  });

  it('renders filter list', () => {
    render(<DrawerMap />, state);
    expect(
      screen.getByText('Filter list mock', { exact: false })
    ).toMatchSnapshot();
  });

  it('the state of the drawer can be toggled when menu button and chevron left are clicked', () => {
    state.map.map_drawer = {
      open: true,
      overlays: true,
      baseMap: true,
      filters: true,
    };

    const { store } = render(<DrawerMap />, state);
    fireEvent.click(screen.getByTestId('drawerToggle'));

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({ type: 'map/drawerToggle' });
  });
});
