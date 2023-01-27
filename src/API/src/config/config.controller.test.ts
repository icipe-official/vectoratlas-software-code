import { Test, TestingModule } from '@nestjs/testing';
import { ConfigController } from './config.controller';
import { readFileSync } from 'fs';

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('{"test":"result"}'),
  watchFile: jest.fn(),
  readdirSync: jest.fn().mockReturnValue(['test1', 'test2']),
  default: {
    readFileSync: jest.fn().mockReturnValue('{"test":"result"}'),
    watchFile: jest.fn(),
  },
}));

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
    it('the controller should return a list of flags', async () => {
      const featureFlagAPI = await controller.getFeatureFlags();
      expect(readFileSync).toHaveBeenCalledWith(
        process.cwd() + '/public/feature_flags.json',
        'utf8',
      );
      expect(featureFlagAPI).toEqual({ test: 'result' });
    });
  });

  describe('getMapStyles', () => {
    it('the controller should return a list of objects indicating the map styles', async () => {
      const mapStylesAPI = await controller.getMapStyles();
      expect(readFileSync).toHaveBeenCalledWith(
        process.cwd() + '/public/map_styles.json',
        'utf8',
      );
      expect(mapStylesAPI).toEqual({ test: 'result' });
    });
  });

  describe('getVersion', () => {
    it('the controller should return the version', async () => {
      const versionAPI = await controller.getVersion();
      expect(versionAPI).toEqual('{"test":"result"}');
    });
  });

  describe('getMappingTemplates', () => {
    it('returns the template directories', async () => {
      expect((await controller.getMappingTemplates())).toEqual(['test1', 'test2'])
    })
  })
});
