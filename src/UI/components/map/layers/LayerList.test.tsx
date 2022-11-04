import React from 'react';
import { render } from '../../../test_config/render';
import { screen, fireEvent } from '@testing-library/dom';
import LayerList from './layerList';
import { initialState } from '../../../state/mapSlice';

describe('Drawer list components display and interaction testing', () => {
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

  describe('Overlays list is rendered correctly and interaction behaves as expected', () => {
    it('when overlays list is open, it renders the correct number of overlays and their details', () => {
      const overlays = [
        {
          name: 'testOverlay',
          sourceLayer: 'testLayer',
          sourceType: 'testType',
        },
      ];

      render(
        <LayerList
          sectionTitle="Overlays"
          overlays={overlays}
          sectionFlag="overlays"
        />,
        testState
      );

      const numOverlays = screen.getByTestId('overlaysListContainer').children
        .length;
      expect(numOverlays == overlays.length);
    });

    it('dispatches a toggle action to display the list of overlays when drawer is open', () => {
      const testOverlays = [
        {
          name: 'overlayTestOverlay1',
          sourceLayer: 'overlayTestLayer',
          sourceType: 'overlayTestType',
        },
        {
          name: 'overlayTestOverlay2',
          sourceLayer: 'overlayTestLayer',
          sourceType: 'overlayTestType',
        },
      ];

      const { store } = render(
        <LayerList
          sectionTitle="Overlays"
          overlays={testOverlays}
          sectionFlag="overlays"
        />,
        testState
      );
      fireEvent.click(screen.getByTestId('overlaysButton'));
      const actions = store.getActions();

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        payload: 'overlays',
        type: 'map/drawerListToggle',
      });
    });
    it('dispatches two toggle actions to open the drawer and then open the list of overlays', () => {
      testState.map.map_drawer = {
        open: false,
        overlays: false,
        baseMap: false,
      };
      const testOverlays = [
        {
          name: 'overlayTestOverlay1',
          sourceLayer: 'overlayTestLayer',
          sourceType: 'overlayTestType',
        },
        {
          name: 'overlayTestOverlay2',
          sourceLayer: 'overlayTestLayer',
          sourceType: 'overlayTestType',
        },
      ];

      const { store } = render(
        <LayerList
          sectionTitle="Overlays"
          overlays={testOverlays}
          sectionFlag="overlays"
        />,
        testState
      );
      fireEvent.click(screen.getByTestId('overlaysButton'));
      const actions = store.getActions();

      expect(actions).toHaveLength(2);
      expect(actions).toEqual([
        {
          payload: undefined,
          type: 'map/drawerToggle',
        },
        {
          payload: 'overlays',
          type: 'map/drawerListToggle',
        },
      ]);
    });
  });

  describe('Base map list is rendered correctly and interaction behaves as expected', () => {
    it('when base map list is open, it renders the correct number of base map overlays and their details', () => {
      const baseMapOverlays = [
        {
          name: 'baseTestOverlay',
          sourceLayer: 'baseTestLayer',
          sourceType: 'baseTestType',
        },
        {
          name: 'baseTestOverlay',
          sourceLayer: 'baseTestLayer',
          sourceType: 'baseTestType',
        },
      ];

      render(
        <LayerList
          sectionTitle="Base Map"
          overlays={baseMapOverlays}
          sectionFlag="baseMap"
        />,
        testState
      );

      const numOverlays = screen.getByTestId('baseMapListContainer').children
        .length;
      expect(numOverlays == baseMapOverlays.length);
    });

    it('dispatches a toggle action to display the list for the base map', () => {
      const baseMapOverlays = [
        {
          name: 'baseTestOverlay1',
          sourceLayer: 'baseTestLayer',
          sourceType: 'baseTestType',
        },
        {
          name: 'baseTestOverlay2',
          sourceLayer: 'baseTestLayer',
          sourceType: 'baseTestType',
        },
      ];

      const { store } = render(
        <LayerList
          sectionTitle="Base Map"
          overlays={baseMapOverlays}
          sectionFlag="baseMap"
        />,
        testState
      );
      fireEvent.click(screen.getByTestId('baseMapButton'));
      const actions = store.getActions();

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        payload: 'baseMap',
        type: 'map/drawerListToggle',
      });
    });
  });
});
