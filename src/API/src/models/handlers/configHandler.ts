import * as fs from 'fs';
import config from '../../config/config';

const OVERLAY_FOLDER = config.get('tileServerDataFolder') + 'overlays/';
const CONFIG_LOCATION = config.get('tileServerDataFolder');

export const updateTileServerConfig = (modelOutputName) => {
  const currentConfig = JSON.parse(
    fs.readFileSync(CONFIG_LOCATION + 'config.json', 'utf8'),
  );
  currentConfig.data[modelOutputName] = {
    mbtiles: `overlays/${modelOutputName}.mbtiles`,
  };

  fs.writeFileSync(
    CONFIG_LOCATION + 'config.json',
    JSON.stringify(currentConfig, null, 2),
  );
};

export const updateApiOverlayConfig = (modelOutputName, displayName) => {
  const overlayConfigLocation =
    config.get('configFolder') + '/map_overlays.json';
  const apiConfig = JSON.parse(fs.readFileSync(overlayConfigLocation, 'utf8'));
  const filteredConfig = apiConfig.filter((l) => l.name !== modelOutputName);
  const updatedConfig = [
    ...filteredConfig,
    {
      name: modelOutputName,
      displayName: displayName,
      sourceLayer: 'overlays',
      sourceType: 'raster',
    },
  ];
  fs.writeFileSync(
    overlayConfigLocation,
    JSON.stringify(updatedConfig, null, 2),
  );
};

export const updateMapStylesConfig = (modelOutputName) => {
  const stylesConfigLocation = config.get('configFolder') + '/map_styles.json';
  const stylesConfig = JSON.parse(
    fs.readFileSync(stylesConfigLocation, 'utf8'),
  );
  const filteredConfig = stylesConfig.layers.filter(
    (l) => l.name !== modelOutputName,
  );

  stylesConfig.layers = [
    ...filteredConfig,
    {
      name: modelOutputName,
      colorChange: 'fill',
      fillColor: [74, 144, 226, 0.75],
    },
  ];

  fs.writeFileSync(stylesConfigLocation, JSON.stringify(stylesConfig, null, 2));
};

export const addTriggerFile = () => {
  const triggerFileLocation = OVERLAY_FOLDER + 'trigger.txt';
  if (!fs.existsSync(triggerFileLocation)) {
    fs.writeFileSync(triggerFileLocation, '');
  }
};
