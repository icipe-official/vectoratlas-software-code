import { Controller, Get } from '@nestjs/common';
import * as featureFlags from '../../public/feature_flags.json';
import * as mapStyles from '../../public/map_styles.json';
import * as fs from 'fs';
import config from './config';

type MapStyles = {
  layers: {name:string; fillColor?: number[], strokeColor?:number[], strokeWidth?:number , zIndex?:number }[]
}

@Controller('config')
export class ConfigController {
  @Get('featureflags')
  async getFeatureFlags(): Promise<{ flag: string; on: boolean }[]> {
    return featureFlags;
  }

  @Get('version')
  async getVersion(): Promise<string> {
    return fs.readFileSync(`${config.get('publicFolder')}/public/version.txt`, 'utf8');
  }

  @Get('map-styles')
  async getMapStyles(): Promise<MapStyles> {
    return mapStyles;
  }
}

  