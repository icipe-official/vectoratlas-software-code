import { Test, TestingModule } from '@nestjs/testing';
import { ConfigController } from './config.controller';
import * as featureFlags from '../../public/feature_flags.json';
import * as mapStyles from '../../public/map_styles.json';

jest.mock('fs', () => ({ readFileSync: jest.fn().mockReturnValue('2.0.0') }));

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
      expect(featureFlagAPI).toBe(featureFlags);
    });
  });

  describe('getMapStyles', () => {
    it('the controller should return a list of objects indicating the map styles', async () => {
      const mapStylesAPI = await controller.getMapStyles();
      expect(mapStylesAPI).toBe(mapStyles);
    });
  });

  describe('getVersion', () => {
    it('the controller should return the version', async () => {
      const versionAPI = await controller.getVersion();
      expect(versionAPI).toBe('2.0.0');
    });
  });
});
