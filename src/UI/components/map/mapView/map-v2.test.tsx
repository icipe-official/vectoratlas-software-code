import React from 'react';
import { MapWrapperV2 } from './map-v2';
import { render } from '../../../test_config/render';
import { initialState } from '../../../state/map/mapSlice';
import { AppState } from '../../../state/store';
import {
  buildBaseMapLayer,
  updateBaseMapStyles,
  updateOverlayLayers,
} from './layerUtils';

jest.mock('./layerUtils', () => ({
  buildBaseMapLayer: jest.fn(),
  updateBaseMapStyles: jest.fn(),
  updateOverlayLayers: jest.fn(),
}));
jest.mock('./pointUtils', () => ({
  buildPointLayer: jest.fn(),
  updateOccurrencePoints: jest.fn(),
}));
jest.mock('../../../state/map/actions/getOccurrenceData', () => ({
  getOccurrenceData: jest
    .fn()
    .mockReturnValue({ type: 'test-getOccurrenceData' }),
}));
jest.mock('ol/Map', () =>
  jest.fn().mockReturnValue({
    setTarget: jest.fn(),
    on: jest.fn(),
    getAllLayers: jest.fn().mockReturnValue([]),
    addLayer: jest.fn(),
  })
);
jest.mock('ol/View', () => jest.fn());
jest.mock('ol/layer/VectorTile', () =>
  jest.fn().mockReturnValue({
    set: jest.fn(),
  })
);
jest.mock('ol/proj', () => ({
  transform: () => ({}),
}));
jest.mock(
  '../layers/drawerMap',
  () =>
    function DrawerMap() {
      return <div>DrawerMap</div>;
    }
);

describe('MapWrapperV2', () => {
  it('renders the map wrapper', () => {
    const state: Partial<AppState> = {
      map: {
        ...initialState(),
        map_overlays: [
          {
            name: 'test1',
            displayName: 'Overlays',
            sourceLayer: 'overlays',
            sourceType: 'raster',
            isVisible: true,
          },
          {
            name: 'test2',
            displayName: 'World',
            sourceLayer: 'world',
            sourceType: 'vector',
            isVisible: true,
          },
        ],
        map_drawer: {
          open: false,
          overlays: false,
          baseMap: false,
          filters: false,
          download: false,
        },
      },
    };
    const { store } = render(<MapWrapperV2 />, state);

    expect(updateBaseMapStyles).toHaveBeenCalled();
    expect(updateOverlayLayers).toHaveBeenCalled();

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: 'test-getOccurrenceData' });
  });
});
