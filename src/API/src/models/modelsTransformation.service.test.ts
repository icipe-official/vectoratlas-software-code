import { buildTestingModule } from '../testHelpers';
import { ModelsTransformationService } from './modelsTransformation.service';
import { runProcess } from './handlers/processHandler';
import {
  addTriggerFile,
  updateApiOverlayConfig,
  updateMapStylesConfig,
  updateTileServerConfig,
} from './handlers/configHandler';
import { Logger } from '@nestjs/common';

jest.mock('./handlers/processHandler', () => ({
  runProcess: jest.fn(),
}));
jest.mock('./handlers/configHandler', () => ({
  addTriggerFile: jest.fn(),
  updateApiOverlayConfig: jest.fn(),
  updateMapStylesConfig: jest.fn(),
  updateTileServerConfig: jest.fn(),
}));

jest.useFakeTimers();

describe('modelsTransformation service', () => {
  let service: ModelsTransformationService;
  let logger: Logger;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await buildTestingModule();

    service = module.get<ModelsTransformationService>(
      ModelsTransformationService,
    );
    logger = module.get<Logger>(Logger);
  });

  describe('sets status', () => {
    it('to running when first submitted', async () => {
      const status = await service.postProcessModelOutput(
        'model1',
        'Model 1',
        1.0,
      );
      expect(status).toEqual({ status: 'RUNNING' });
    });

    it('to error if the process throws an error', async () => {
      (runProcess as jest.Mock).mockImplementationOnce(
        (scriptName, scriptParameters, logger, handleError) => {
          handleError();
        },
      );

      const status = await service.postProcessModelOutput(
        'model2',
        'Model 2',
        1.0,
      );
      expect(status).toEqual({ status: 'ERROR' });
    });

    it('to error if non-zero return code returned from process', async () => {
      (runProcess as jest.Mock).mockImplementationOnce(
        (scriptName, scriptParameters, logger, handleError, handleClose) => {
          handleClose(-2);
        },
      );

      const status = await service.postProcessModelOutput(
        'model2a',
        'Model 2a',
        1.0,
      );
      expect(status).toEqual({ status: 'ERROR' });
    });

    it('to done if zero return code returned from process', async () => {
      (runProcess as jest.Mock).mockImplementationOnce(
        (scriptName, scriptParameters, logger, handleError, handleClose) => {
          handleClose(0);
        },
      );

      const status = await service.postProcessModelOutput(
        'model3',
        'Model 3',
        1.0,
      );
      expect(status).toEqual({ status: 'DONE' });

      expect(updateTileServerConfig).toHaveBeenCalledWith('model3');
      expect(updateApiOverlayConfig).toHaveBeenCalledWith('model3', 'Model 3');
      expect(updateMapStylesConfig).toHaveBeenCalledWith('model3');
      expect(addTriggerFile).toHaveBeenCalled();
    });
  });

  it('clears up old jobs after the timeout', async () => {
    (runProcess as jest.Mock).mockImplementationOnce(
      (scriptName, scriptParameters, logger, handleError) => {
        handleError();
      },
    );

    // ensure previous tests are cleared out
    jest.advanceTimersByTime(61 * 1000);

    const status = await service.postProcessModelOutput(
      'model4',
      'Model 4',
      1.0,
    );
    expect(status).toEqual({ status: 'ERROR' });

    // wait for the current job to expire
    jest.advanceTimersByTime(61 * 1000);

    await service.postProcessModelOutput('model4', 'Model 4', 1.0);
    expect(logger.log).toHaveBeenCalledWith('Clearing up finished jobs: ', [
      'model4',
    ]);
  });
});
