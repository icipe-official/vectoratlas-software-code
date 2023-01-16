import React from 'react';
import { MapWrapper } from './map';
import { render } from '../../test_config/render';
import { initialState } from '../../state/map/mapSlice';
import { AppState } from '../../state/store';

jest.mock('ol/Map', () =>
  jest.fn().mockReturnValue({
    setTarget: jest.fn(),
    on: jest.fn(),
    getAllLayers: jest.fn().mockReturnValue([]),
    addLayer: jest.fn(),
  })
);
jest.mock('ol/control/Control', () =>
jest.fn().mockReturnValue({
  set: jest.fn(),
})
);
jest.mock('ol/View', () => jest.fn());
jest.mock('ol/layer/VectorTile', () =>
  jest.fn().mockReturnValue({
    set: jest.fn(),
  })
);
jest.mock('ol/source/VectorTile', () => jest.fn());
jest.mock('ol/layer/Vector', () =>
  jest.fn().mockReturnValue({
    set: jest.fn(),
  })
);
jest.mock('ol/source/Vector', () => jest.fn());
jest.mock('ol/format/GeoJSON', () =>
  jest.fn().mockReturnValue({
    readFeatures: jest.fn(),
  })
);
jest.mock('ol/source/XYZ', () => jest.fn());
jest.mock('ol/style/Text', () => jest.fn());
jest.mock('ol/layer/Tile', () =>
  jest.fn().mockReturnValue({
    setOpacity: jest.fn(),
    setProperties: jest.fn(),
    set: jest.fn(),
  })
);
jest.mock('ol/source/Raster', () =>
  jest.fn().mockReturnValue({
    on: jest.fn(),
  })
);
jest.mock('ol/layer/Image', () =>
  jest.fn().mockReturnValue({
    set: jest.fn(),
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
  Icon: jest.fn(),
}));
jest.mock(
  './layers/drawerMap',
  () =>
    function DrawerMap() {
      return <div>DrawerMap</div>;
    }
);

describe(MapWrapper.name, () => {
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
    render(<MapWrapper />, state);
  });
});
