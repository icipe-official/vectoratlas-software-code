import React from 'react';
import { render } from '../../../test_config/render';
import { screen, fireEvent } from '@testing-library/dom';
import FilterList from './filterList';
import { initialState } from '../../../state/mapSlice';

describe('filter list components display and interaction testing', () => {
  let testState: any;
  beforeEach(() => {
    testState = { map: JSON.parse(JSON.stringify(initialState)) };
    testState.map.map_drawer = {
      open: true,
      overlays: true,
      baseMap: true,
      filters: true,
    };
  });

  describe('filter list is rendesred correctly and interaction behaves as expected', () => {
    it('dispatches a toggle action to display the list of filters when drawer is open', () => {
      const { store } = render(
        <FilterList sectionTitle="Filters" sectionFlag="filters" />,
        testState
      );
      fireEvent.click(screen.getByTestId('filtersButton'));
      const actions = store.getActions();

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        payload: 'filters',
        type: 'map/drawerListToggle',
      });
    });
    it('dispatches two toggle actions to open the drawer and then open the list of filters', () => {
      testState.map.map_drawer = {
        open: false,
        filters: false,
      };

      const { store } = render(
        <FilterList sectionTitle="Filters" sectionFlag="filters" />,
        testState
      );
      fireEvent.click(screen.getByTestId('filtersButton'));
      const actions = store.getActions();

      expect(actions).toHaveLength(2);
      expect(actions).toEqual([
        {
          payload: undefined,
          type: 'map/drawerToggle',
        },
        {
          payload: 'filters',
          type: 'map/drawerListToggle',
        },
      ]);
    });
  });
});
