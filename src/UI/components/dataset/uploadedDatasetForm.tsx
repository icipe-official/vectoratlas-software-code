import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  ClickAwayListener,
  Container,
  FormControlLabel,
  FormLabel,
  Grow,
  Hidden,
  IconButton,
  InputBaseProps,
  InputProps,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  TextField,
  Tooltip,
  Popper,
  CircularProgress,
  Card,
  CardHeader,
  Avatar,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownload from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';
import { SaveOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { downloadRawDatasetFile } from '../../api/api';
import { getUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { useRouter } from 'next/router';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import RuleIcon from '@mui/icons-material/Rule';
import React from 'react';
import { CustomizedSnackBar } from '../shared/CustomizedSnackBar';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { ApproveRejectDialog } from '../shared/approveRejectDialog';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { approveUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { rejectUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { reviewUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { StatusRenderer } from '../shared/StatusRenderer';

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

  const handleAction = async (formValues: object) => {
    const comments = formValues?.comments;
    if (actionType == APPROVE) {
      dispatch(approveUploadedDataset({ datasetId, comments }));
    }
    if (actionType == REVIEW) {
      dispatch(reviewUploadedDataset({ datasetId, comments }));
    }
    if (actionType == REJECT) {
      dispatch(rejectUploadedDataset({ datasetId, comments }));
    }
    if (actionType == VALIDATE) {
      console.log('Handling validate');
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
        
          <div>
            <StatusRenderer
              status={uploadedDataset?.status || ''}
              title={uploadedDataset.status}
            />
          </div>
          <div>
            <TextField
              required
              disabled
              fullWidth
              label="Dataset title"
              id="title"
              InputProps={inputProps}
              value={uploadedDataset?.title}
            />
          </div>
          <div>
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
          </div>
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
            <Button
              component="label"
              role={undefined}
              startIcon={<CloudDownload />}
              onClick={() => {
                downloadRawDatasetFile(uploadedDataset.uploaded_file_name);
              }}
            >
              {uploadedDataset?.uploaded_file_name}
            </Button>
          </div>
          <div>
            {!readonly && (
              <Button
                component="label"
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
              title={actionType}
              isOpen={actionDialogOpen}
              onOk={(formValues: object) => {
                console.log('Returned form values: ', formValues);
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
