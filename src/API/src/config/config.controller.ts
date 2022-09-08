import { Controller, Get } from '@nestjs/common';
import * as featureFlags from '../../public/feature_flags.json';
import * as fs from 'fs';
import config from './config';

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
}
