import {
  buildBaseMapLayer,
  updateBaseMapStyles,
  updateOverlayLayers,
} from './layerUtils';

jest.mock('ol/style', () => ({
  Circle: jest.fn((s) => s),
  Style: jest.fn((s) => ({
    ...s,
    getFill: () => s.fill,
  })),
  Fill: jest.fn((s) => ({
    ...s,
    getColor: () => s.color,
  })),
  Stroke: jest.fn((s) => s),
  Icon: jest.fn((s) => s),
}));
jest.mock('ol/source/XYZ', () => jest.fn());
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
jest.mock('ol/layer/VectorTile', () =>
  jest.fn((s) => ({
    ...s,
    set: jest.fn(),
  }))
);
jest.mock('ol/source/VectorTile', () => jest.fn((s) => s));

const buildMockBaseLayer = (name) => ({
  get: (key) => {
    if (key === 'name') {
      return name;
    } else if (key === 'base-map') {
      return true;
    }
  },
  setVisible: jest.fn(),
  setStyle: jest.fn(),
});

const buildMockOverlayLayer = (name) => ({
  get: (key) => {
    if (key === 'name') {
      return name;
    } else if (key === 'overlay-map') {
      return true;
    } else if (key === 'overlay-color') {
      return [0, 255, 0, 1];
    }
  },
  setVisible: jest.fn(),
  setStyle: jest.fn(),
});

describe('layerUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateBaseMapStyles', () => {
    const layerVisibility = [
      { name: 'land', isVisible: true },
      { name: 'ocean', isVisible: false },
    ];

    const mapStyles = {
      layers: [
        {
          name: 'land',
          fillColor: 'green',
        },
        {
          name: 'ocean',
          fillColor: 'blue',
        },
      ],
    };
    let layers;
    let map;

    beforeEach(() => {
      layers = [buildMockBaseLayer('land'), buildMockBaseLayer('ocean')];
      map = {
        getAllLayers: () => layers,
      };
    });

    it('updates visibility correctly', () => {
      updateBaseMapStyles(mapStyles, layerVisibility, map);

      expect(layers[0].setVisible).toHaveBeenCalledWith(true);
      expect(layers[1].setVisible).toHaveBeenCalledWith(false);
    });

    it('sets styles of the base map correctly', () => {
      updateBaseMapStyles(mapStyles, layerVisibility, map);

      const styleFunction = layers[0].setStyle.mock.calls[0][0];
      const calculatedStyle = styleFunction({
        get: () => 'land',
      });
      expect(calculatedStyle.fill.color).toEqual('green');
    });

    it('uses the default style if the layer is not in styles map', () => {
      layers = [buildMockBaseLayer('not-in-map')];
      map = {
        getAllLayers: () => layers,
      };

      updateBaseMapStyles(mapStyles, layerVisibility, map);

      const styleFunction = layers[0].setStyle.mock.calls[0][0];
      const calculatedStyle = styleFunction({
        get: () => 'not-in-map',
      });
      expect(calculatedStyle.fill.color).toEqual([0, 0, 0, 0]);
      expect(calculatedStyle.stroke).toEqual({
        color: 'white',
        width: 0.5,
      });
    });
  });

  describe('updateOverlayLayers', () => {
    const mapStyles = {
      layers: [
        {
          name: 'overlay',
          fillColor: 'green',
        },
      ],
    };

    beforeEach(() => {});

    it('removes layers that have been hidden', () => {
      const layerVisibility = [{ name: 'overlay', isVisible: false }];

      const layers = [buildMockOverlayLayer('overlay')];
      const map = {
        getAllLayers: jest.fn().mockReturnValueOnce(layers).mockReturnValue([]),
        removeLayer: jest.fn(),
      };

      updateOverlayLayers(mapStyles, layerVisibility, map);

      expect(map.removeLayer).toHaveBeenCalledWith(layers[0]);
    });

    it('adds new layers that have been shown', () => {
      const layerVisibility = [{ name: 'overlay', isVisible: true }];

      const insertAtMock = jest.fn();

      const map = {
        getAllLayers: jest.fn().mockReturnValue([]),
        getLayers: () => ({ insertAt: insertAtMock }),
      };

      updateOverlayLayers(mapStyles, layerVisibility, map);

      const call = insertAtMock.mock.calls[0];
      expect(call[0]).toEqual(-1);
      expect(call[1].set).toHaveBeenCalledWith('name', 'overlay');
      expect(call[1].set).toHaveBeenCalledWith('overlay-map', true);
      expect(call[1].set).toHaveBeenCalledWith('overlay-color', 'green');
    });

    it('updates the styles of existing layers', () => {
      const layerVisibility = [{ name: 'overlay', isVisible: true }];

      const newMapStyles = {
        layers: [
          {
            name: 'overlay',
            fillColor: [255, 0, 0, 1],
          },
        ],
      };

      const insertAtMock = jest.fn();

      const layers = [buildMockOverlayLayer('overlay')];
      const map = {
        getAllLayers: jest.fn().mockReturnValue(layers),
        removeLayer: jest.fn(),
        getLayers: () => ({ insertAt: insertAtMock }),
      };

      updateOverlayLayers(newMapStyles, layerVisibility, map);

      expect(map.removeLayer).toHaveBeenCalledWith(layers[0]);

      const call = insertAtMock.mock.calls[0];
      expect(call[0]).toEqual(-1);
      expect(call[1].set).toHaveBeenCalledWith('name', 'overlay');
      expect(call[1].set).toHaveBeenCalledWith('overlay-map', true);
      expect(call[1].set).toHaveBeenCalledWith('overlay-color', [255, 0, 0, 1]);
    });
  });

  describe('buildBaseMapLayer', () => {
    it('builds a vector layer referencing the right url', () => {
      const baseMapLayer = buildBaseMapLayer();

      expect((baseMapLayer as any).source.url).toEqual(
        '/data/world/{z}/{x}/{y}.pbf'
      );
      expect(baseMapLayer.set).toHaveBeenCalledWith('base-map', true);
    });
  });
});