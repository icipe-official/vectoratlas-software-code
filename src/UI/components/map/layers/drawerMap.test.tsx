import React from 'react';
import { initialState } from '../../../state/mapSlice';
import { AppState } from '../../../state/store';
import {render} from '../../../test_config/render';
import { fireEvent, screen } from '@testing-library/dom';
import {DrawerMap} from './drawerMap';

describe(DrawerMap.name, () => {
  it('renders drawer', () => {
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
    render(<DrawerMap/>, state);
    fireEvent.click(screen.getByTestId('drawerToggle'));
    expect(screen.getByText('Base Map')).toBeVisible();
    expect(screen.getByText('Overlays')).toBeVisible();
  });
});
