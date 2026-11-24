import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast, ToastContent } from 'react-toastify';
import React from 'react';
import { MapState } from '../mapSlice';
import { getTranslation } from '../../../utils/localization';
import {
  createBackgroundExport,
  getBackgroundExportStatus,
} from '../../../api/api';
// Retry configuration for network-resilient polling.
const MAX_POLL_ERRORS = 5; // consecutive poll failures before giving up
const POLL_INTERVAL_MS = 3000; // poll every 3 seconds
const MAX_POLL_DURATION_MS = 30 * 60 * 1000; // give up after 30 minutes

/**
 * Generates a unique client request ID for this download attempt.
 * Reused across automatic and manual retries — never regenerated
 * for the same download button click.
 */
function generateClientRequestId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Computes a content hash from sorted occurrence IDs.
 * When two users filter the same dataset and get the same set of IDs
 * (in any order), the sorted hash matches, enabling cross-user reuse
 * of completed export jobs.
 *
 * Returns null when no occurrence IDs are provided (download all),
 * because the underlying data may have changed — no reuse in that case.
 */
async function computeContentHash(
  occurrenceIds?: string[]
): Promise<string | null> {
  if (!occurrenceIds || occurrenceIds.length === 0) {
    return null; // download all — never reuse
  }
  const sorted = [...occurrenceIds].sort();
  const data = new TextEncoder().encode(JSON.stringify(sorted));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check whether the browser currently has a network connection.
 * Uses navigator.onLine and, if available, the Network Information API's
 * effectiveType to detect slow/unstable connections.
 */
function checkNetworkStability(): { online: boolean; slow: boolean } {
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const conn = (navigator as any)?.connection;
  const slow =
    conn?.effectiveType === '2g' ||
    conn?.effectiveType === 'slow-2g' ||
    conn?.saveData === true;
  return { online, slow };
}

/**
 * Retries the initial export POST with exponential backoff.
 * Handles 504/502/503 gateway errors that may occur when the envoy
 * proxy times out before the API finishes queuing the job.
 */
async function createExportWithRetry(
  payload: Parameters<typeof createBackgroundExport>[0],
  maxRetries = 2
): Promise<ReturnType<typeof createBackgroundExport>> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await createBackgroundExport(payload);
    } catch (e: any) {
      lastError = e;
      const status = e?.response?.status;
      // Retry on gateway timeouts and server errors; don't retry on 4xx
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw e;
      }
      if (attempt < maxRetries) {
        const backoffMs = 2000 * Math.pow(2, attempt); // 2s, 4s
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }
  }
  throw lastError;
}

/**
 * Show a toast with a retry button that calls the provided callback.
 * Returns the toast ID so the caller can dismiss it later.
 */
function showRetryToast(
  message: string,
  onRetry: () => void,
  onClose?: () => void
): React.ReactText {
  const content: ToastContent = React.createElement(
    'div',
    null,
    React.createElement('p', { style: { margin: '0 0 8px' } }, message),
    React.createElement(
      'button',
      {
        onClick: onRetry,
        style: {
          padding: '4px 12px',
          cursor: 'pointer',
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '0.85rem',
        },
      },
      'Retry'
    )
  );

  return toast(content, {
    type: 'error',
    autoClose: false,
    closeButton: true,
    onClose,
  });
}

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

    // Generate idempotency key and content hash ONCE for this download
    // attempt. Both are reused across all retries (automatic and manual).
    const clientRequestId = generateClientRequestId();
    const contentHash = await computeContentHash(occurrenceIds);

    // Check network before starting
    const { online, slow } = checkNetworkStability();
    if (!online) {
      toast.update(downloadStatus, {
        render:
          'You appear to be offline. Please check your connection and try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      throw new Error('No network connection');
    }
    if (slow) {
      toast.update(downloadStatus, {
        render:
          'Your connection appears slow. The export may take longer than usual...',
      });
    }

    // Helper to start the export with retry button on failure
    const startExport = async (): Promise<string> => {
      try {
        const { jobId } = await createExportWithRetry({
          filtersJson: JSON.stringify(filters),
          generateDoi: !!generateDoi,
          downloaderName,
          downloaderEmail,
          occurrenceIds,
          clientRequestId,
          contentHash: contentHash || undefined,
        });
        return jobId;
      } catch (e: any) {
        toast.update(downloadStatus, {
          render: '',
          isLoading: false,
          autoClose: 1,
        });

        const is504 = e?.response?.status === 504;
        const message = is504
          ? 'The server took too long to respond. This may be due to high load or network latency. Your export may still have been queued.'
          : `Failed to start export: ${e.message}`;

        return new Promise<string>((_resolve, reject) => {
          const retryToastId = showRetryToast(
            message,
            async () => {
              toast.dismiss(retryToastId);
              // Re-show the loading toast and retry
              const newToastId = toast.loading('Retrying...');
              try {
                const { jobId } = await createExportWithRetry({
                  filtersJson: JSON.stringify(filters),
                  generateDoi: !!generateDoi,
                  downloaderName,
                  downloaderEmail,
                  occurrenceIds,
                  clientRequestId,
                  contentHash: contentHash || undefined,
                });
                toast.update(newToastId, {
                  render: 'Export queued successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
                });
                // Start polling for this retry
                startPolling(jobId, newToastId);
              } catch (retryErr: any) {
                toast.update(newToastId, {
                  render: `Failed to start export: ${retryErr.message}`,
                  type: 'error',
                  isLoading: false,
                  autoClose: 5000,
                });
                reject(retryErr);
              }
            },
            () => reject(e)
          );
        });
      }
    };

    /**
     * Polls the export status until completed, failed, or max errors reached.
     * On failure, shows a retry toast that re-checks the status.
     */
    const startPolling = (jobId: string, toastId: React.ReactText) => {
      let consecutiveErrors = 0;
      const startTime = Date.now();

      const pollInterval = setInterval(async () => {
        // Give up if the export has been running too long
        if (Date.now() - startTime > MAX_POLL_DURATION_MS) {
          clearInterval(pollInterval);
          toast.update(toastId, {
            render: 'Export timed out — please try again later',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
          return;
        }

        try {
          const job = await getBackgroundExportStatus(jobId);
          consecutiveErrors = 0;

          if (job.status === 'completed' && job.downloadUrl) {
            clearInterval(pollInterval);

            const downloadComplete =
              (await getTranslation('ReduxActions.Map.downloadComplete')) ||
              'Download Complete';
            toast.update(toastId, {
              render: downloadComplete,
              type: 'success',
              isLoading: false,
              autoClose: 2000,
            });

            // Trigger download via a hidden <a> element instead of
            // window.location.href, which navigates away from the page.
            const link = document.createElement('a');
            link.href = job.downloadUrl;
            link.download = job.fileName || `filteredData-${jobId}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (job.status === 'failed') {
            clearInterval(pollInterval);

            const downloadFailed =
              (await getTranslation('ReduxActions.Map.downloadFailed', {
                message: job.errorMessage,
              })) || `Export failed: ${job.errorMessage}`;

            toast.update(toastId, {
              render: downloadFailed,
              type: 'error',
              isLoading: false,
              autoClose: 5000,
            });
          } else {
            // Status is 'queued' or 'processing'
            const downloading =
              (await getTranslation('ReduxActions.Map.downloading')) ||
              'Processing';
            toast.update(toastId, {
              render: `${downloading}: ${job.progress || 0}%`,
            });
          }
        } catch (err: any) {
          consecutiveErrors++;
          const { online: stillOnline } = checkNetworkStability();

          // Detect offline state: either navigator.onLine is false,
          // OR the error is a network error with no HTTP response (e.g.
          // ERR_INTERNET_DISCONNECTED, which fires before navigator.onLine
          // updates when using DevTools offline toggle).
          const isNetworkError =
            !err?.response &&
            (err?.code === 'ERR_NETWORK' ||
              err?.code === 'ECONNABORTED' ||
              err?.message?.includes('Network Error') ||
              err?.message?.includes('ERR_INTERNET_DISCONNECTED'));

          if (!stillOnline || isNetworkError) {
            clearInterval(pollInterval);
            // Replace loading toast, then show a retry toast for reconnection
            toast.update(toastId, {
              render: '',
              isLoading: false,
              autoClose: 1,
            });
            showRetryToast(
              'Connection lost. The export may still be running on the server. Click Retry to check its status.',
              () => {
                const newToastId = toast.loading('Rechecking export status...');
                startPolling(jobId, newToastId);
              }
            );
            return;
          }

          if (consecutiveErrors >= MAX_POLL_ERRORS) {
            clearInterval(pollInterval);
            const status = err?.response?.status;
            const message =
              status === 504 || status === 502 || status === 503
                ? 'Server is taking too long to respond. The export may still be running — you can check its status manually.'
                : `Error checking export status (${consecutiveErrors} failed attempts). The export may still be running.`;

            // Replace the loading toast with a retry toast
            toast.update(toastId, {
              render: '',
              isLoading: false,
              autoClose: 1,
            });

            showRetryToast(message, () => {
              // Re-show loading toast and resume polling
              const newToastId = toast.loading('Rechecking export status...');
              startPolling(jobId, newToastId);
            });
          } else {
            // Transient error — keep polling, show a warning
            toast.update(toastId, {
              render: `Processing (connection issue, retrying ${consecutiveErrors}/${MAX_POLL_ERRORS}): ${jobId.slice(
                0,
                8
              )}`,
            });
          }
        }
      }, POLL_INTERVAL_MS);
    };

    // Main flow: start export, then poll
    try {
      const jobId = await startExport();
      // startExport resolves with jobId even on retry
      // But if the retry toast was rejected (user dismissed), startExport throws
      // If we got here, we have a jobId — start polling
      toast.update(downloadStatus, {
        render: 'Export queued. Processing...',
      });
      startPolling(jobId, downloadStatus);
    } catch (e: any) {
      // startExport rejected (user dismissed retry toast) — error already shown
      throw e;
    }
  }
);
