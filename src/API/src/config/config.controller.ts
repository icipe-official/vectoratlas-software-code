import { Controller, Get } from '@nestjs/common';
import * as featureFlags from '../../public/feature_flags.json';
import * as mapStyles from '../../public/map_styles.json';
import * as tileServerOverlays from '../../public/map_overlays.json';
import * as fs from 'fs';
import config from './config';
type MapStyles = {
  layers: {
    name: string;
    fillColor?: number[];
    strokeColor?: number[];
    strokeWidth?: number;
    zIndex?: number;
  }[];
};
type RasterLayer = {
  name: string;
  sourceLayer: string;
  sourceType: string;
};

type VectorLayer = {
  name: string;
  sourceType: string;
  overlays: { name: string }[];
};

type RasterLayer = {
  name: string;
  source: string;
  sourceType: string;
};

type VectorLayer = {
  name: string;
  source: string;
  sourceType: string;
  layers: { name: string }[];
};

@Controller('config')
export class ConfigController {
  @Get('featureflags')
  async getFeatureFlags(): Promise<{ flag: string; on: boolean }[]> {
    return featureFlags;
  }
  @Get('version')
  async getVersion(): Promise<string> {
    return fs.readFileSync(
      `${config.get('publicFolder')}/public/version.txt`,
      'utf8',
    );
  }
  @Get('map-styles')
  async getMapStyles(): Promise<MapStyles> {
    return mapStyles;
  }

  @Get('tile-server-overlays')
  async getTileServerOverlays(): Promise<(RasterLayer | VectorLayer)[]> {
    return tileServerOverlays;
  }
}
