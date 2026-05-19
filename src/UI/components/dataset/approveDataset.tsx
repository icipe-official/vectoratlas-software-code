import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  LinearProgress,
  Menu,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import UploadIcon from '@mui/icons-material/Upload';

import {
  adhocValidateDataset,
  approveUploadedDataset_v2,
  validateDataset,
} from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { SentimentVerySatisfied } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  setAggregateValidationErrors,
  setIngestionErrors,
  // setAggregateValidationErrors,
  setValidationErrors,
} from '../../state/uploadedDataset/uploadedDatasetSlice';
import { UploadedDatasetActionTypeEnum } from '../../state/state.types';
import ValidationErrorsView from './ValidationErrorsView';
import { useTranslations } from 'next-intl';
import { approveDataset } from '../../state/review/actions/approveDataset';
import { approveDatasetAuthenticated } from '../../api/api';

interface IValidateProps {
  datasetId?: string;
  file?: File;
  validationType: string;
}

const ApproveDatasetComponent = (props: IValidateProps, ref: any) => {
  const t = useTranslations('UploadedDatasetDetailPage');

  const dispatch = useAppDispatch();
  const ingestionErrors = useAppSelector(
    (state) => state.uploadedDataset.ingestionErrors
  );
  const isProcessingAction = useAppSelector(
    (state) => state.uploadedDataset.isProcessingAction
  );
  const ingestionStatus = useAppSelector(
    (state) => state.uploadedDataset.ingestionStatus
  );

  const ingestionProgress = useAppSelector(
    (state) => state.uploadedDataset.ingestionProgress
  );

  const [datasetId, setDatasetId] = useState(props.datasetId);
  const [file, setFile] = useState(props.file);
  const [actionType, setActionType] = useState(props.validationType);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const startRow = useAppSelector((state) => state.uploadedDataset.startRow);
  const endRow = useAppSelector((state) => state.uploadedDataset.endRow);

  const aggregateErrors = useAppSelector(
    (state) => state.uploadedDataset.aggregateValidationErrors
  );

  const showIngestionFailure = () => {
    const isDatasetIngested = ingestionStatus == 'Completed';
    return (
      !isDatasetIngested &&
      !isProcessingAction &&
      Object.keys(ingestionErrors || {}).length > 0
    );
  };

  const showIngestionSuccess = () => {
    const isDatasetIngested = ingestionStatus == 'Completed';
    return (
      isDatasetIngested &&
      !isProcessingAction &&
      Object.keys(ingestionErrors || {}).length == 0
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      validate() {
        const doValidate = async () => {
          dispatch(setIngestionErrors({}));
          await dispatch(
            approveDataset({
              datasetId: datasetId || '',
            })
          );
        };
        doValidate();
      },
    }),
    [actionType, attachedFiles, datasetId, dispatch]
  );

  return (
    <div
      style={{
        width: '100%',
        minWidth: '300px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {!isProcessingAction &&
        !showIngestionFailure() &&
        !showIngestionSuccess() && (
          <div>
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              <Typography variant="h6">{t('approvalDialog.intro')}</Typography>
            </div>
          </div>
        )}
      <main
      // style={{ width: '100%', minWidth: '300px', minHeight: '100px', display: 'flex', justifyContent: 'center' }}
      ></main>
      {showIngestionFailure() && (
        <Typography color="primary" variant="h2">
          {ingestionErrors}
        </Typography>
      )}

      {showIngestionSuccess() && (
        <Box
          sx={{
            alignSelf: 'center',
            flexGrow: 1,
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {/* <CheckCircleOutlineIcon
                color="primary"
                sx={{ width: 40, height: 40, alignSelf: 'center' }}
              /> */}
            <Typography color="primary" variant="h6">
              {t('approvalDialog.ingestionSuccess')}
            </Typography>
          </div>
        </Box>
      )}
      {isProcessingAction && (
        // <LinearProgress
        //   style={{ padding: 5 }}
        //   variant="determinate"
        //   value={ingestionProgress}
        //   aria-label="Ingestion Progress"
        // />
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <div
            style={{
              padding: '5px',
              border: '1px solid #ccc',
              maxWidth: 400,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                p: 3,
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('actionDialog.startRow')}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {startRow}
                </Typography>
              </Box>
              <CircularProgress />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('actionDialog.endRow')}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {endRow}
                </Typography>
              </Box>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};
const ApproveDatasetDialog = forwardRef(ApproveDatasetComponent);
export default ApproveDatasetDialog;
