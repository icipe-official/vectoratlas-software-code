import { Injectable, Logger } from '@nestjs/common';
import config from '../config/config';
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
import { ensureDirectoryExists } from 'src/utils';
import { UploadedModelService } from 'src/db/uploaded-model/uploaded-model.service';

const RUNNING = 'RUNNING';
const DONE = 'DONE';
const ERROR = 'ERROR';

const runningJobs = {};

const BLOB_FOLDER = config.get('modelOutputBlobFolder');
const OVERLAY_FOLDER = config.get('tileServerDataFolder') + 'overlays/';

const startProcessingLayer = async (
  modelOutputName,
  displayName,
  maxValue,
  blobLocation,
  logger: Logger,
  uploadedModelId: string,
  uploadedModelService: UploadedModelService,
) => {
  runningJobs[modelOutputName] = {
    status: RUNNING,
    pid: 1,
    lastUpdated: Date.now(),
  };

  const handleError = () => {
    runningJobs[modelOutputName].status = ERROR;
  };

  const handlerClose = (code) => {
    if (runningJobs[modelOutputName].status !== ERROR && code === 0) {
      runningJobs[modelOutputName].status = DONE;
    }

    if (runningJobs[modelOutputName].status === DONE) {
      updateTileServerConfig(modelOutputName);
      updateApiOverlayConfig(modelOutputName, displayName, blobLocation);
      updateMapStylesConfig(modelOutputName);

      addTriggerFile();
    }

    cleanupDownloadedBlob(modelOutputName);
  };

  try {
    ensureDirectoryExists(BLOB_FOLDER);
    ensureDirectoryExists(OVERLAY_FOLDER);
    // await downloadModelOutput(modelOutputName, blobLocation);
    const model = await uploadedModelService.getUploadedModel(
      uploadedModelId,
      false,
    );
    const destPath = await uploadedModelService.downloadToFileStorage(
      model.uploaded_file_name,
      BLOB_FOLDER,
      modelOutputName,
      true, // pass true since transformGeotiff.sh expects a .tif not .tiff
    );

    runProcess(
      './transformGeotiff.sh',
      [BLOB_FOLDER, modelOutputName, OVERLAY_FOLDER, maxValue],
      logger,
      handleError,
      handlerClose,
    );
  } catch (e) {
    handleError();
    Logger.error(e);
  }
};

const jobStillRunning = (modelOutputName) => {
  return (
    runningJobs[modelOutputName].status !== DONE &&
    runningJobs[modelOutputName].status !== ERROR
  );
};

const clearUpOldJobs = (logger: Logger) => {
  const currentTime = Date.now();
  const finishedJobs = Object.keys(runningJobs)
    .filter((job) => !jobStillRunning(job))
    .filter((job) => currentTime - runningJobs[job].lastUpdated > 60 * 1000);

  logger.log('Clearing up finished jobs: ', finishedJobs);

  finishedJobs.forEach((job) => {
    delete runningJobs[job];
  });
};

@Injectable()
export class ModelsTransformationService {
  constructor(
    private logger: Logger,
    private uploadedModelService: UploadedModelService,
  ) {}

  async postProcessModelOutput(
    modelOutputName: string,
    displayName: string,
    maxValue: number,
    blobLocation: string,
    uploadedModelId: string,
  ) {
    if (!runningJobs[modelOutputName]) {
      await startProcessingLayer(
        modelOutputName,
        displayName,
        maxValue,
        blobLocation,
        this.logger,
        uploadedModelId,
        this.uploadedModelService,
      );
    }

    const status = {
      status: runningJobs[modelOutputName].status,
    };

    // clear up all finished jobs before returning
    clearUpOldJobs(this.logger);

    return status;
  }
}
