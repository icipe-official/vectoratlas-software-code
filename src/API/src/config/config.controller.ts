import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
import config from './config';

type MapStyles = {
  layers: {
    name: string;
    colorChange: string;
    fillColor?: number[];
    strokeColor?: number[];
    strokeWidth?: number;
    zIndex?: number;
  }[];
  scales: {
    name: string;
    colorMap: number[][];
    unit: string;
    min: number;
    max: number;
  }[];
};

type RasterLayer = {
  name: string;
  displayName: string;
  sourceLayer: string;
  sourceType: string;
  blobLocation?: string;
};

type VectorLayer = {
  name: string;
  sourceType: string;
  blobLocation?: string;
  overlays: {
    name: string;
    displayName: string;
  }[];
};

const loadJSONConfig = (filepath) => () => {
  const contents = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(contents);
};

const loadFeatureFlags = loadJSONConfig(
  `${config.get('configFolder')}/feature_flags.json`,
);
const loadVersion = () =>
  fs.readFileSync(`${config.get('publicFolder')}/public/version.txt`, 'utf8');
const loadMapStyles = loadJSONConfig(
  `${config.get('configFolder')}/map_styles.json`,
);
const loadTileServerOverlays = loadJSONConfig(
  `${config.get('configFolder')}/map_overlays.json`,
);

let featureFlagConfig = loadFeatureFlags();

fs.watchFile(`${config.get('configFolder')}/feature_flags.json`, () => {
  featureFlagConfig = loadFeatureFlags();
});

let versionConfig = loadVersion();

fs.watchFile(`${config.get('publicFolder')}/public/version.txt`, () => {
  versionConfig = loadVersion();
});

let mapStylesConfig = loadMapStyles();

fs.watchFile(`${config.get('configFolder')}/map_styles.json`, () => {
  mapStylesConfig = loadMapStyles();
});

let tileServerOverlaysConfig = loadTileServerOverlays();

fs.watchFile(`${config.get('configFolder')}/map_overlays.json`, () => {
  tileServerOverlaysConfig = loadTileServerOverlays();
});

@Controller('config')
export class ConfigController {
  @Get('featureflags')
  async getFeatureFlags(): Promise<{ flag: string; on: boolean }[]> {
    return featureFlagConfig;
  }

  @Get('version')
  async getVersion(): Promise<string> {
    return versionConfig;
  }

  @Get('map-styles')
  async getMapStyles(): Promise<MapStyles> {
    return mapStylesConfig;
  }

  @Get('tile-server-overlays')
  async getTileServerOverlays(): Promise<(RasterLayer | VectorLayer)[]> {
    return tileServerOverlaysConfig;
  }

  @Get('mapping-templates')
  async getMappingTemplates() {
    const templateList = [];
    const dir = `${config.get('publicFolder')}/public/templates/`;
    fs.readdirSync(dir).forEach((item) => {
      templateList.push(item);
    });
    return templateList;
  }
}
