import { Test, TestingModule } from '@nestjs/testing';
import { ConfigController } from './config.controller';
import * as featureFlags from '../../public/feature_flags.json';
import * as mapStyles from '../../public/map_styles.json';
import * as fs from 'fs';
import config from './config';
import { Console } from 'console';
import { version } from 'yargs';

describe('ConfigController', () => {
  let controller: ConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigController],
    }).compile();

    controller = module.get<ConfigController>(ConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFeatureFlags', () => {
    it('the controller should return a list of objects indicating the flagged components and their status', async () => {
      const featureFlagAPI = await controller.getFeatureFlags();
      console.log(featureFlagAPI)
      expect(featureFlagAPI).toBe(featureFlags);
    });
  });

  describe('getMapStyles', () => {
    it('the controller should return a list of objects indicating the map styles', async () => {
      const mapStylesAPI = await controller.getMapStyles();
      console.log(mapStylesAPI)
      expect(mapStylesAPI).toBe(mapStyles);
    });
  });

  describe('getVersion', () => {
    it('the controller should return the version', async () => {
      const versionAPI = await controller.getVersion();
      
      jest.mock("fs", () => {
        return {
          readFileSync: jest.fn()   
        } 
      })

      console.log(versionAPI);
      expect(versionAPI).toBe('2.0.0')
      //console.log(fs.readFileSync('mockTo/version.txt'));
      //expect(versionAPI).toBe(fs.readFileSync('mockTo/version.txt'),
    });
  });
});
