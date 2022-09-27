import React from 'react';
import {render } from '../../../test_config/render';
import { screen, fireEvent} from '@testing-library/dom';
import DrawerList from './drawerList';
import { initialState } from '../../../state/mapSlice';

describe('Drawer list components display and interaction testing', () => {

  let testState;
  beforeEach(() => {
    testState = {map: JSON.parse(JSON.stringify(initialState))};
    testState.map.map_drawer = { open: true, overlays: true, baseMap: true };
  } );

  describe('Overlays list is rendered correctly and interaction behaves as expected', () => {
    it('when overlays list is open, it renders the correct number of overlays and their details', () => {
      const overlays = [{name: 'testOverlay', sourceLayer: 'testLayer', sourceType: 'testType'}];

      render(<DrawerList sectionTitle='Overlays' overlays={overlays} sectionFlag='overlays'/>, testState);

      const numOverlays = screen.getByTestId('overlaysListContainer').children.length;
      expect(numOverlays == overlays.length);
    });

    it('dispatches a toggle action to display the list of overlays', () => {
      const testOverlays = [
        {name: 'overlayTestOverlay1', sourceLayer: 'overlayTestLayer', sourceType: 'overlayTestType'},
        {name: 'overlayTestOverlay2', sourceLayer: 'overlayTestLayer', sourceType: 'overlayTestType'}
      ];

      const { store } =  render(<DrawerList sectionTitle='Overlays' overlays={testOverlays} sectionFlag='overlays'/>, testState);
      fireEvent.click(screen.getByTestId('overlaysButton'));
      const actions = store.getActions();

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({'payload': 'overlays', 'type': 'map/drawerListToggle'});
    });
  });
  
  describe('Base map list is rendered correctly and interaction behaves as expected', () => {
    it('when base map list is open, it renders the correct number of base map overlays and their details', () => {
      const baseMapOverlays = [
        {name: 'baseTestOverlay', sourceLayer: 'baseTestLayer', sourceType: 'baseTestType'},
        {name: 'baseTestOverlay', sourceLayer: 'baseTestLayer', sourceType: 'baseTestType'}
      ];

      render(<DrawerList sectionTitle='Base Map' overlays={baseMapOverlays} sectionFlag='baseMap'/>, testState);

      const numOverlays = screen.getByTestId('baseMapListContainer').children.length;
      expect(numOverlays == baseMapOverlays.length);
    });

    it('dispatches a toggle action to display the list for the base map', () => {
      const baseMapOverlays = [
        {name: 'baseTestOverlay1', sourceLayer: 'baseTestLayer', sourceType: 'baseTestType'},
        {name: 'baseTestOverlay2', sourceLayer: 'baseTestLayer', sourceType: 'baseTestType'}
      ];

      const { store } =  render(<DrawerList sectionTitle='Base Map' overlays={baseMapOverlays} sectionFlag='baseMap'/>, testState);
      fireEvent.click(screen.getByTestId('baseMapButton'));
      const actions = store.getActions();

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({'payload': 'baseMap', 'type': 'map/drawerListToggle'});
    });
  });
});
