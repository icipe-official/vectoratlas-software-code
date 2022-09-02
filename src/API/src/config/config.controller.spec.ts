import { Test, TestingModule } from '@nestjs/testing';
import { ConfigController } from './config.controller';
import  * as featureFlags  from '../../public/feature_flags.json'
import  * as mapStyles  from '../../public/map_styles.json'

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
    it('should return a list of objects indicating the flagged components and their status', () => {
      async function jestFlags(){
        let jestFlagVals = await controller.getFeatureFlags();
        console.log(jestFlagVals)
        return jestFlagVals
      }  
      expect(jestFlags() === featureFlags)
    });
  })
});


// https://circleci.com/blog/getting-started-with-nestjs-and-automatic-testing/#c-consent-modal