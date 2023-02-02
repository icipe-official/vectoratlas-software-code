import { buildTestingModule } from '../testHelpers';
import { ModelsTransformationService } from './modelsTransformation.service';
import { runProcess } from './handlers/processHandler';
import {
  addTriggerFile,
  updateApiOverlayConfig,
  updateMapStylesConfig,
  updateTileServerConfig,
} from './handlers/configHandler';
import {
  downloadModelOutput,
  cleanupDownloadedBlob,
} from './handlers/blobHandler';
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
jest.mock('./handlers/blobHandler', () => ({
  downloadModelOutput: jest.fn(),
  cleanupDownloadedBlob: jest.fn(),
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
        'blob/container/model1.tif',
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
        'blob/container/model2.tif',
      );
      expect(status).toEqual({ status: 'ERROR' });
    });

    it('to error if non-zero return code returned from process', async () => {
      (runProcess as jest.Mock).mockImplementationOnce(
        (scriptName, scriptParameters, logger, handleError, handleClose) => {
          handleError();
          handleClose(-2);
        },
      );

      const status = await service.postProcessModelOutput(
        'model2a',
        'Model 2a',
        1.0,
        'blob/container/model2a.tif',
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
        'blob/container/model3.tif',
      );
      expect(status).toEqual({ status: 'DONE' });

      expect(updateTileServerConfig).toHaveBeenCalledWith('model3');
      expect(updateApiOverlayConfig).toHaveBeenCalledWith(
        'model3',
        'Model 3',
        'blob/container/model3.tif',
      );
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
      'blob/container/model4.tif',
    );
    expect(status).toEqual({ status: 'ERROR' });

    // wait for the current job to expire
    jest.advanceTimersByTime(61 * 1000);

    await service.postProcessModelOutput(
      'model4',
      'Model 4',
      1.0,
      'blob/container/model4.tif',
    );
    expect(logger.log).toHaveBeenCalledWith('Clearing up finished jobs: ', [
      'model4',
    ]);
  });

  it('downloads the blob when the job starts running', async () => {
    await service.postProcessModelOutput(
      'model5',
      'Model 5',
      1.0,
      'blob/container/model5.tif',
    );

    expect(downloadModelOutput).toHaveBeenCalledWith(
      'model5',
      'blob/container/model5.tif',
    );
  });

  describe('cleans up the blob', () => {
    it('if the transformation is successful', async () => {
      (runProcess as jest.Mock).mockImplementationOnce(
        (scriptName, scriptParameters, logger, handleError, handleClose) => {
          handleClose(0);
        },
      );

      await service.postProcessModelOutput(
        'model6',
        'Model 6',
        1.0,
        'blob/container/model6.tif',
      );

      expect(cleanupDownloadedBlob).toHaveBeenCalledWith('model6');
    });

    it('if the transformation fails', async () => {
      (runProcess as jest.Mock).mockImplementationOnce(
        (scriptName, scriptParameters, logger, handleError, handleClose) => {
          handleClose(-2);
        },
      );

      await service.postProcessModelOutput(
        'model7',
        'Model 7',
        1.0,
        'blob/container/model7.tif',
      );

      expect(cleanupDownloadedBlob).toHaveBeenCalledWith('model7');
    });
  });
});
