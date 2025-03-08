import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import UploadIcon from '@mui/icons-material/Upload';

import {
  adhocValidateDataset,
  validateDataset,
} from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { SentimentVerySatisfied } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { setValidationErrors } from '../../state/uploadedDataset/uploadedDatasetSlice';
import { UploadedDatasetActionTypeEnum } from '../../state/state.types';
import ValidationErrorsView from './ValidationErrorsView';

interface IValidateProps {
  datasetId?: string;
  file?: File;
  validationType: string;
}

const ValidateDatasetComponent = (props: IValidateProps, ref: any) => {
  const dispatch = useAppDispatch();
  const validationErrors = useAppSelector(
    (state) => state.uploadedDataset.validationErrors
  );
  const isDatasetValid = useAppSelector(
    (state) => state.uploadedDataset.isDatasetValid
  );
  const isProcessingAction = useAppSelector(
    (state) => state.uploadedDataset.isProcessingAction
  );
  const [datasetId, setDatasetId] = useState(props.datasetId);
  const [file, setFile] = useState(props.file);
  const [actionType, setActionType] = useState(props.validationType);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const showValidationFailure = () => {
    if (actionType == UploadedDatasetActionTypeEnum.ADHOC_VALIDATE) {
      return (
        !isDatasetValid &&
        !isProcessingAction &&
        attachedFiles.length > 0 &&
        Object.keys(validationErrors || {}).length > 0
      );
    } else {
      return (
        !isDatasetValid &&
        !isProcessingAction &&
        Object.keys(validationErrors || {}).length > 0
      );
    }
  };

  const showValidationSuccess = () => {
    if (actionType == UploadedDatasetActionTypeEnum.ADHOC_VALIDATE) {
      return (
        isDatasetValid &&
        !isProcessingAction &&
        attachedFiles.length > 0 &&
        Object.keys(validationErrors || {}).length == 0
      );
    } else {
      return (
        isDatasetValid &&
        !isProcessingAction &&
        Object.keys(validationErrors || {}).length == 0
      );
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files) {
      setAttachedFiles(Array.from(event.target.files));
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      validate() {
        const doValidate = async () => {
          dispatch(setValidationErrors({}));
          if (actionType == UploadedDatasetActionTypeEnum.VALIDATE) {
            await dispatch(
              validateDataset({
                datasetId: datasetId,
              })
            );
          } else if (
            actionType == UploadedDatasetActionTypeEnum.ADHOC_VALIDATE
          ) {
            if (attachedFiles.length == 0) {
              toast.error('You must attach a file');
              return;
            }
            await dispatch(
              adhocValidateDataset({
                files: attachedFiles,
              })
            );
          }
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
        !showValidationFailure() &&
        !showValidationSuccess() && (
          <div style={{ justifyContent: 'center', display: 'flex' }}>
            <Typography variant="h6">
              Click on the validate button to start validation
            </Typography>
          </div>
        )}
      <main
      // style={{ width: '100%', minWidth: '300px', minHeight: '100px', display: 'flex', justifyContent: 'center' }}
      >
        {actionType == UploadedDatasetActionTypeEnum.ADHOC_VALIDATE && (
          <>
            <Button
              variant="text"
              component="label"
              sx={{ textTransform: 'none' }}
              //   style={{ width: '50%', minWidth: '200px', fontSize: 'small' }}
            >
              <UploadIcon />
              Attach dataset
              <input
                type="file"
                hidden
                multiple={false}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
              />
            </Button>
            <Box mt={1}>
              {attachedFiles.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() =>
                    setAttachedFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  sx={{
                    marginRight: 1,
                    marginBottom: 1,
                    fontSize: 'small',
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </main>
      {showValidationFailure() && <ValidationErrorsView />}

      {showValidationSuccess() && (
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
              Dataset is valid!
            </Typography>
          </div>
        </Box>
      )}
      {isProcessingAction && (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
};
const ValidateDatasetDialog = forwardRef(ValidateDatasetComponent);
export default ValidateDatasetDialog;
