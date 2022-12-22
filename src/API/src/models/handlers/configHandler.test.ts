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
      updateApiOverlayConfig('new-layer', 'New Layer');

      const expectedConfig = [
        ...currentConfig,
        {
          name: 'new-layer',
          displayName: 'New Layer',
          sourceLayer: 'overlays',
          sourceType: 'raster',
        },
      ];

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'config/folder/map_overlays.json',
        JSON.stringify(expectedConfig, null, 2),
      );
    });

    it('updates an existing layer in config', () => {
      updateApiOverlayConfig('existing layer', 'New Layer Name');

      const expectedConfig = [
        {
          name: 'existing layer',
          displayName: 'New Layer Name',
          sourceLayer: 'overlays',
          sourceType: 'raster',
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
    it('adds the file if it does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      addTriggerFile();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'data/folder/overlays/trigger.txt',
        '',
      );
    });

    it('does not add the trigger file if it already exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      addTriggerFile();

      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
