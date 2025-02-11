import {
  Box,
  Button,
  Container,
  FormLabel,
  InputProps,
  CircularProgress,
  Card,
  CardContent,
  Link,
  Checkbox,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import CloudDownload from '@mui/icons-material/CloudDownload';
import { SaveOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
// import { downloadDatasetFile } from '../../api/api';
import {
  downloadDatasetFile,
  getUploadedDataset,
} from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { useRouter } from 'next/router';
import React from 'react';
import { CustomizedSnackBar } from '../shared/CustomizedSnackBar';
import {
  ActionAssignees,
  ApproveRejectDialog,
} from '../shared/approveRejectDialog';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { approveUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { rejectUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { reviewUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { StatusRenderer } from '../shared/statusRenderer';
import { DatasetFileType } from '../../state/state.types';

const ASSIGN: string = 'Assign';
const APPROVE: string = 'Approve';
const REVIEW: string = 'Review';
const REJECT: string = 'Reject';
const VALIDATE: string = 'Validate';

const ACTION_TYPES = [APPROVE, REJECT, VALIDATE];

type UploadedDatasetProps = {
  // is_new_upload?: boolean;
  datasetId: string;
};

interface DisplayItemProps {
  label: string;
  value: string | React.ReactNode;
  isHtml?: boolean;
  isComponent?: boolean;
}

interface DisplayFileProps {
  datasetId: string;
  label: string;
  url: string;
  fileType: DatasetFileType;
}

const DisplayItem = (props: DisplayItemProps) => {
  return (
    <Grid2
      container
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'flex-start' }}
    >
      <Grid2 xs={4} sx={{ padding: 2 }}>
        <FormLabel filled color="error" sx={{ fontWeight: 'bold' }}>
          {props.label}
        </FormLabel>
      </Grid2>
      {!props.isComponent && (
        <Grid2 xs={8}>
          {props.isHtml && (
            <div
              dangerouslySetInnerHTML={{
                __html: props?.value?.toString() || '',
              }}
            />
          )}
          {!props.isHtml && <FormLabel>{props.value}</FormLabel>}
        </Grid2>
      )}
      {props.isComponent && <Grid2 xs={8}>{props.value}</Grid2>}
    </Grid2>
  );
};

const DisplayFile = ({ datasetId, fileType, label, url }: DisplayFileProps) => {
  const dispatch = useAppDispatch();
  const doDownload = async () => {
    dispatch(downloadDatasetFile({ datasetId, fileType }));
  };
  return (
    <DisplayItem
      label={label}
      isComponent
      value={
        <Button
          component="label"
          role={undefined}
          startIcon={<CloudDownload />}
          sx={{ textTransform: 'none' }}
          onClick={doDownload}
        >
          {url.split('/').pop()}
        </Button>
        // <Link
        //   // href={url}
        //   onClick={doDownload}
        // >
        //   {url.split('/').pop()}
        // </Link>
      }
    />
  );
};

const UploadedDatasetForm = (props: UploadedDatasetProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [autoHideDuration, setAutoHideDuration] = useState(6000);
  const [approveAlertOpen, setApproveAlertOpen] = useState(false);
  const [rejectAlertOpen, setRejectAlertOpen] = useState(false);
  const [validateAlertOpen, setValidateAlertOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const [datasetId, setDatasetId] = useState(props.datasetId || '');
  // const [dataset, setDataset] = useState(null);

  const [readonly, setReadOnly] = useState<boolean>(true);

  const [actionType, setActionType] = useState('');

  const uploadedDataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );
  const loading = useAppSelector((state) => state.uploadedDataset.loading);
  const downloading = useAppSelector(
    (state) => state.uploadedDataset.downloading
  );

  const handleCloseActionsMenu = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    actionName: string,
    selectedIdx: number
  ) => {
    setSelectedIndex(selectedIdx);
    setActionType(actionName);
    setApproveAlertOpen(true);
    setActionDialogOpen(true);
  };

  const handleAction = async (formValues: ActionAssignees) => {
    const comments = formValues?.comments || '';
    if (actionType == APPROVE) {
      dispatch(approveUploadedDataset({ datasetId, comments }));
    }
    if (actionType == REVIEW) {
      dispatch(reviewUploadedDataset({ datasetId, comments }));
    }
    if (actionType == REJECT) {
      dispatch(rejectUploadedDataset({ datasetId, comments }));
    }
  };

  const handleSubmit = () => {
    setActionType('');
  };

  const getStatusIndicator = (status: string) => {
    let color = '#d9182e';
    switch (status) {
      case 'Pending':
        color = '#d9182e';
        break;
      case 'Approved':
        color = '#4caf50';
        break;

      case 'Under Review':
        color = '#ffa500';
        break;

      case 'Rejected':
        color = '#d9182e';
        break;
      case 'Rejected By Reviewer Manager':
        color = '#d9182e';
        break;
      default:
        break;
    }
    return color;
  };

  const inputProps: InputProps = {
    readOnly: readonly,
  };

  useEffect(() => {
    const getDataset = async () => {
      if (datasetId) {
        dispatch(getUploadedDataset(datasetId));
      }
      //setDataset(res);
    };
    getDataset();
  }, [dispatch, datasetId]);

  useEffect(() => {}, [actionDialogOpen]);

  const SnackBarItems = () => {
    return (
      <div>
        <CustomizedSnackBar
          open={approveAlertOpen}
          message="Dataset approved"
          autoHideDuration={autoHideDuration}
          onClose={() => {}}
          updateParentStateHandler={() => setApproveAlertOpen(false)}
        />
        <CustomizedSnackBar
          open={rejectAlertOpen}
          message="Reject dataset"
          autoHideDuration={autoHideDuration}
          onClose={() => {}}
          updateParentStateHandler={() => setRejectAlertOpen(false)}
        />
        <CustomizedSnackBar
          open={validateAlertOpen}
          message="Validate dataset"
          autoHideDuration={autoHideDuration}
          onClose={() => {}}
          updateParentStateHandler={() => setValidateAlertOpen(false)}
        />
      </div>
    );
  };

  // const ToolbarItems = () => {
  //   return (
  //     <Box sx={{ flexGrow: 1 }}>
  //   <Grid2 container spacing={1}>
  //     <Grid2 size={4}>
  //     <TextField label="First Name" />
  //     </Grid2>
  //     <Grid2 size={4}>
  //     <TextField label="Last Name" />
  //     </Grid2>
  //   </Grid2></Box>
  //   )
  // };

  return (
    <div>
      <Container>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1 /*width: '100ch'*/ },
            maxWidth: '100%',
            bgcolor: '#fff',
          }}
          noValidate
          autoComplete="off"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <StatusRenderer
              status={uploadedDataset?.status || ''}
              statusTitle={uploadedDataset?.status}
              label={uploadedDataset?.title}
            />
            {uploadedDataset?.is_reupload_requested && (
              <StatusRenderer
                status={'Pending'}
                statusTitle={'Pending Dataset Reupload'}
                label={''}
              />
            )}
          </div>

          <Card>
            <CardContent>
              <Box sx={{ flexGrow: 1 }}>
                <DisplayItem
                  label="Description"
                  value={uploadedDataset?.description || ''}
                  isHtml
                />
                <DisplayItem
                  label="Provided DOI"
                  value={uploadedDataset?.provided_doi || ''}
                />
                <DisplayItem
                  label="Primary Reviewer"
                  value={uploadedDataset?.primary_reviewers || ''}
                />
                <DisplayItem
                  label="Tertiary Reviewer"
                  value={uploadedDataset?.tertiary_reviewers || ''}
                />
                <DisplayItem
                  label="Generate a DOI for this dataset"
                  isComponent
                  value={
                    <Checkbox
                      disabled
                      size="small"
                      checked={uploadedDataset?.is_doi_requested}
                    />
                  }
                />
                {uploadedDataset?.uploaded_file_name && (
                  <DisplayFile
                    datasetId={uploadedDataset.id}
                    label="Original data"
                    url={uploadedDataset.uploaded_file_name}
                    fileType={'Raw'}
                  />
                )}
                {uploadedDataset?.uploaded_file_name_primary_reviewed && (
                  <DisplayFile
                    datasetId={uploadedDataset.id}
                    label="Primary reviewed data"
                    url={uploadedDataset.uploaded_file_name_primary_reviewed}
                    fileType={'Primary Approved'}
                  />
                )}
                {uploadedDataset?.uploaded_file_name_tertiary_reviewed && (
                  <DisplayFile
                    datasetId={uploadedDataset.id}
                    label="Tertiary reviewed data"
                    url={uploadedDataset.uploaded_file_name_tertiary_reviewed}
                    fileType={'Tertiary Approved'}
                  />
                )}
                {/* <DisplayItem
                  label="Original file"
                  isComponent
                  value={
                    <Link href={uploadedDataset.uploaded_file_name}>
                      {uploadedDataset.uploaded_file_name.split('/').pop()}
                    </Link>
                    // <Button
                    //   component="label"
                    //   role={undefined}
                    //   startIcon={<CloudDownload />}
                    //   sx={{ textTransform: 'none' }}
                    //   onClick={() => {
                    //     downloadRawDatasetFile(
                    //       uploadedDataset.uploaded_file_name
                    //     );
                    //   }}
                    // >
                    //   {uploadedDataset?.uploaded_file_name}
                    // </Button>
                  }
                /> */}
              </Box>
            </CardContent>
          </Card>
          {/* <div>
            <TextField
              required
              disabled
              fullWidth
              label="Dataset title"
              id="title"
              InputProps={inputProps}
              value={uploadedDataset?.title}
            />
          </div> */}
          {/* <div>
            <TextField
              required
              disabled
              fullWidth
              multiline
              rows={4}
              label="Dataset description"
              id="description"
              InputProps={inputProps}
              value={uploadedDataset?.description}
            />
          </div>
          <div>
            <TextField
              fullWidth
              disabled
              label="Enter existing DOI, if any"
              id="provided_doi"
              InputProps={inputProps}
              value={uploadedDataset?.provided_doi}
            />
          </div> */}
          <div>
            {/* <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload CSV File */}
            {/* <TextField
              label="Upload CSV file"
              type="file"
              // onChange={(event) => console.log(event.target.files)}
              InputProps={inputProps}
              // value={uploadedDataset?.uploaded_file_name}
            /> */}
            {/* </Button> */}
          </div>
          <div>
            {!readonly && (
              <Button
                // component="label"
                role={undefined}
                variant="contained"
                type="submit"
                startIcon={<SaveOutlined />}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </div>

          {/* <SnackBarItems /> */}

          {
            /*ACTION_TYPES.includes(actionType) &&*/ <ApproveRejectDialog
              isApprove={actionType == APPROVE}
              title={actionType}
              isOpen={actionDialogOpen}
              onOk={(formValues: ActionAssignees) => {
                handleAction(formValues);
                setActionType('');
                setActionDialogOpen(false);
              }}
              onCancel={() => {
                setActionType('');
                setActionDialogOpen(false);
              }}
            />
          }
          {loading && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </div>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default UploadedDatasetForm;
