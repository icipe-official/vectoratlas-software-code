import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { MapState } from '../mapSlice';
import { getTranslation } from '../../../utils/localization';
import {
  createBackgroundExport,
  getBackgroundExportStatus,
} from '../../../api/api';

export const triggerBackgroundExport = createAsyncThunk(
  'export/triggerBackgroundExport',
  async ({
    filters,
    generateDoi,
    downloaderName,
    downloaderEmail,
    occurrenceIds,
  }: {
    filters: MapState['filters'];
    generateDoi?: boolean;
    downloaderName?: string;
    downloaderEmail?: string;
    occurrenceIds?: string[];
  }) => {
    const startingMsg =
      (await getTranslation('ReduxActions.Map.startingExport')) ||
      'Queuing export...';
    const downloadStatus = toast.loading(startingMsg);

    try {
      // 1. Start the job on the backend
      const { jobId } = await createBackgroundExport({
        filtersJson: JSON.stringify(filters),
        generateDoi: !!generateDoi,
        downloaderName,
        downloaderEmail,
        occurrenceIds,
      });

      // 2. Poll the backend until completed or failed
      return new Promise((resolve, reject) => {
        const pollInterval = setInterval(async () => {
          try {
            const job = await getBackgroundExportStatus(jobId);

            if (job.status === 'completed' && job.downloadUrl) {
              clearInterval(pollInterval);

              const downloadComplete =
                (await getTranslation('ReduxActions.Map.downloadComplete')) ||
                'Download Complete';
              toast.update(downloadStatus, {
                render: downloadComplete,
                type: 'success',
                isLoading: false,
                autoClose: 2000,
              });

              // Trigger the browser to download the ZIP via the Azure SAS URL
              window.location.href = job.downloadUrl;
              resolve(job);
            } else if (job.status === 'failed') {
              clearInterval(pollInterval);

              const downloadFailed =
                (await getTranslation('ReduxActions.Map.downloadFailed', {
                  message: job.errorMessage,
                })) || `Export failed: ${job.errorMessage}`;

              toast.update(downloadStatus, {
                render: downloadFailed,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
              });

              reject(new Error(job.errorMessage || 'Export failed'));
            } else {
              // Status is 'queued' or 'processing'
              const downloading =
                (await getTranslation('ReduxActions.Map.downloading')) ||
                'Processing';
              toast.update(downloadStatus, {
                render: `${downloading}: ${job.progress || 0}%`,
              });
            }
          } catch (err: any) {
            clearInterval(pollInterval);
            toast.update(downloadStatus, {
              render: 'Error checking export status',
              type: 'error',
              isLoading: false,
              autoClose: 5000,
            });
            reject(err);
          }
        }, 3000); // Poll every 3 seconds
      });
    } catch (e: any) {
      toast.update(downloadStatus, {
        render: `Failed to start export: ${e.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      throw e;
    }
  }
);
