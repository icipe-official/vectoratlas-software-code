import {
  updateTileServerConfig,
  updateApiOverlayConfig,
  updateMapStylesConfig,
  addTriggerFile,
} from './configHandler';
import * as fs from 'fs';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
}));

jest.mock('../../config/config', () => ({
  default: {
    get: jest.fn((key) => {
      const configMap = {
        tileServerDataFolder: 'data/folder/',
        configFolder: 'config/folder',
      };

      return configMap[key];
    }),
  },
}));

describe('configHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateTileServerConfig', () => {
    it('adds the new mbtiles file to config', () => {
      const currentConfig = {
        otherConfig: 'test',
        data: {
          'existing-layer': {
            mbtiles: 'overlays/existing-layer.mbtiles',
          },
        },
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(currentConfig, null, 2),
      );

      updateTileServerConfig('new-layer');

      const expectedConfig = {
        ...currentConfig,
        data: {
          'existing-layer': {
            mbtiles: 'overlays/existing-layer.mbtiles',
          },
          'new-layer': {
            mbtiles: 'overlays/new-layer.mbtiles',
          },
        },
      };

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'data/folder/config.json',
        JSON.stringify(expectedConfig, null, 2),
      );
    });
  });

  describe('updateApiOverlayConfig', () => {
    let currentConfig;

    beforeEach(() => {
      currentConfig = [
        {
          name: 'existing layer',
        },
      ];

      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(currentConfig, null, 2),
      );
    });

    it('adds the new layer to config', () => {
      updateApiOverlayConfig(
        'new-layer',
        'New Layer',
        'folder/blob/new-layer-123',
      );

      const expectedConfig = [
        ...currentConfig,
        {
          name: 'new-layer',
          displayName: 'New Layer',
          sourceLayer: 'overlays',
          sourceType: 'raster',
          blobLocation: 'folder/blob/new-layer-123',
          scale: 'new-layer-scale',
        },
      ];

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'config/folder/map_overlays.json',
        JSON.stringify(expectedConfig, null, 2),
      );
    });

    it('updates an existing layer in config', () => {
      updateApiOverlayConfig(
        'existing layer',
        'New Layer Name',
        'folder/blob/existing-layer-123',
      );

      const expectedConfig = [
        {
          name: 'existing layer',
          displayName: 'New Layer Name',
          sourceLayer: 'overlays',
          sourceType: 'raster',
          blobLocation: 'folder/blob/existing-layer-123',
          scale: 'existing layer-scale',
        },
      ];

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'config/folder/map_overlays.json',
        JSON.stringify(expectedConfig, null, 2),
      );
    });
  });

  describe('updateMapStylesConfig', () => {
    let currentConfig;

    beforeEach(() => {
      currentConfig = {
        layers: [
          {
            name: 'existing layer',
          },
        ],
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(currentConfig, null, 2),
      );
    });

    it('adds the new layer to config', () => {
      updateMapStylesConfig('new-layer');

      const expectedConfig = {
        ...currentConfig,
        layers: [
          {
            name: 'existing layer',
          },
          {
            name: 'new-layer',
            colorChange: 'fill',
            fillColor: [74, 144, 226, 0.75],
          },
        ],
      };

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'config/folder/map_styles.json',
        JSON.stringify(expectedConfig, null, 2),
      );
    });

    it('updates an existing layer in config', () => {
      updateMapStylesConfig('existing layer');

      const expectedConfig = {
        ...currentConfig,
        layers: [
          {
            name: 'existing layer',
            colorChange: 'fill',
            fillColor: [74, 144, 226, 0.75],
          },
        ],
      };

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'config/folder/map_styles.json',
        JSON.stringify(expectedConfig, null, 2),
      );
    });
  });

  describe('addTriggerFile', () => {
    beforeEach(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date(2020, 3, 1, 0, 0, 0, 0));
    });

    it('updates the trigger file when called', () => {
      addTriggerFile();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'data/folder/trigger.txt',
        '1585699200000',
      );
    });
  });
});
