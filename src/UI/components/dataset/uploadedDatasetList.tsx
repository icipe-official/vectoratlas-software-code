import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Container,
  Link,
  Typography,
  Badge,
  Tooltip,
  ButtonGroup,
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useRouter } from 'next/router';
import { StatusRenderer } from '../shared/statusRenderer';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  getUploadedDatasets,
  getUploadedDataset,
} from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import AddIcon from '@mui/icons-material/Add';
import AssignReviewerDialog from './AssignReviewerDialog';
import { fetchAllUsers } from '../../api/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import UploadIcon from '@mui/icons-material/Upload';
import ClearIcon from '@mui/icons-material/Clear';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RejectDialog from './RejectDialog';
import EmailPopup from '../sendMail/sendMail';
import { Mail } from '@mui/icons-material';
import { UploadedDatasetActionDialog } from './UploadedDatasetActionDialog';
import {
  RolesEnum,
  UploadedDataset,
  UploadedDatasetActionTypeEnum,
  UploadedDatasetStatusEnum,
} from '../../state/state.types';
import { UploadedDatasetActionMenu } from './UploadedDatasetActionMenu';
import { setCurrentUploadedDataset } from '../../state/uploadedDataset/uploadedDatasetSlice';
import DateRenderer from '../shared/dateRenderer';
import { formatDate } from '../../utils/utils';
import { getUserInfo } from '../../state/auth/actions/getUserInfo';
import AuthWrapper from '../shared/AuthWrapper';

interface FilterState {
  assignedToMe: boolean;
  pendingAssignment: boolean;
  pendingApproval: boolean;
}
interface EditToolbarProps {
  // setRows: (newRows: )
}

interface IUser {
  auth0_id: string;
  is_uploader: boolean;
  is_reviewer: boolean;
  is_admin: boolean;
  is_editor: boolean;
  is_reviewer_manager: boolean | null;
  disable_notifications: boolean;
}

export const UploadedDatasetList = () => {
  function AddToolbar(props: EditToolbarProps) {
    const handleCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setState({
        ...state,
        [event.target.name]: event.target.checked,
      });
    };

    const { assignedToMe, pendingAssignment, pendingApproval } = state;

    return (
      <GridToolbarContainer
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#fefaf8',
          padding: 0,
        }}
      >
        {user.roles.includes(RolesEnum.UPLOADER) && (
          <Button
            color="primary"
            startIcon={<AddIcon />}
            // onClick={handleUploadDataset}
            href="/upload"
          >
            Upload new dataset
          </Button>
        )}
        {user.roles.includes(RolesEnum.REVIEWER) && (
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={assignedToMe}
                    onChange={handleCheckboxChange}
                    name="assignedToMe"
                  />
                }
                label="Assigned To Me"
              />
            </FormGroup>
          </FormControl>
        )}
        {user.roles.includes(RolesEnum.REVIEWER_MANAGER) && (
          <>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={pendingAssignment}
                      onChange={handleCheckboxChange}
                      name="pendingAssignment"
                    />
                  }
                  label="Pending Assignment"
                />
              </FormGroup>
            </FormControl>

            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={pendingApproval}
                      onChange={handleCheckboxChange}
                      name="pendingApproval"
                    />
                  }
                  label="Pending Approval"
                />
              </FormGroup>
            </FormControl>
          </>
        )}
        {/* <Button
          color="primary"
          hidden={true}
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedDatasetId('');
            dispatch(setCurrentUploadedDataset(null));
            setValidateActionDialogOpen(true);
          }}
          // href="/upload"
        >
          Validate Dataset
        </Button> */}
      </GridToolbarContainer>
    );
  }

  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [validateActionDialogOpen, setValidateActionDialogOpen] =
    useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(
    null
  );
  const [assignmentType, setAssignmentType] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For menu handling
  const [selectedRow, setSelectedRow] = useState<any>(null); // Track the selected row
  const [rejectDialogOpen, setRejectDialogOpen] = useState<any>(null);
  const [rejectType, setRejectType] = useState<string>('');
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const router = useRouter();
  const [filteredDatasets, setFilteredDatasets] = useState<UploadedDataset[]>(
    []
  );

  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.uploadedDataset.loading);
  const selectedDataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );
  const uploadedDatasets = useAppSelector(
    (state) => state.uploadedDataset.uploadedDatasets
  );

  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth);
  const [state, setState] = useState<FilterState>({
    assignedToMe:
      user.roles.includes(RolesEnum.REVIEWER) &&
      !user.roles.includes(RolesEnum.REVIEWER_MANAGER),
    pendingAssignment: user.roles.includes(RolesEnum.REVIEWER_MANAGER),
    pendingApproval: user.roles.includes(RolesEnum.REVIEWER_MANAGER),
  });

  const loadDatasets = useCallback(async () => {
    await dispatch(getUploadedDatasets());
  }, [dispatch]);

  const selectDataset = async (id: string) => {
    await dispatch(getUploadedDataset(id));
  };

  const loadUsers = async () => {
    const res: any[] = await fetchAllUsers();
    setUsers(res);
  };

  // const columns: GridColDef<typeof rows[number]>[] = [

  const handleOpenPopup = () => {
    setIsEmailPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsEmailPopupOpen(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row); // Set the selected row
    setSelectedDatasetId(row.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDatasetReject = () => {
    setRejectDialogOpen(true);
  };

  const handleDialogClose = () => {
    setActionDialogOpen(false);
    loadDatasets();
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    loadDatasets();
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      renderCell: (params: GridRenderCellParams<any, any>) => {
        if (params.row.is_reupload_requested && !params.row.is_reuploaded) {
          return (
            <Tooltip title="Pending re-upload">
              <Badge color="secondary" variant="dot">
                <Link
                  onClick={() => {
                    router.push({
                      pathname: `/uploaded-dataset/${params.row.id}`,
                    });
                  }}
                >
                  {params.value}
                </Link>
              </Badge>
            </Tooltip>
          );
        }
        return (
          <Link
            onClick={() => {
              router.push({
                pathname: `/uploaded-dataset/${params.row.id}`,
              });
            }}
          >
            {params.value}
          </Link>
        );
      },
      valueGetter: (params: any) => {
        return (
          <Link href={`/uploaded-dataset/${params.row.id}`}>
            {params.row.title}
          </Link>
        );
      },
    },
    {
      field: 'last_upload_date',
      headerName: 'Uploaded On',
      type: 'dateTime',
      width: 150,
      valueGetter: (params: any) => new Date(params.row.last_upload_date),
      renderCell: ({ row }: { row: any }) => (
        <DateRenderer value={row.last_upload_date} />
      ),
    },
    // {
    //   field: 'primary_reviewers',
    //   headerName: 'Primary Reviewer Email',
    //   type: 'string',
    //   width: 200,
    // },
    // {
    //   field: 'tertiary_reviewers',
    //   headerName: 'Tertiary Reviewer Email',
    //   type: 'string',
    //   width: 200,
    // },
    {
      field: 'status',
      headerName: 'Status',
      type: 'string',
      width: 150,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <StatusRenderer status={params.value} statusTitle={params.value} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
              <MoreVertIcon />
            </IconButton>
            <UploadedDatasetActionMenu
              inFormView={false}
              status="Pending"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets, token]);

  useEffect(() => {
    if (selectedDatasetId) {
      dispatch(getUploadedDataset(selectedDatasetId));
    } else {
      dispatch(setCurrentUploadedDataset(null));
    }
  }, [dispatch, selectedDatasetId]);

  // useEffect(() => {
  //   // setFilteredDatasets([...uploadedDatasets]);
  // }, [uploadedDatasets]);

  useEffect(() => {
    const filtered = uploadedDatasets.filter((el) => {
      if (
        state.assignedToMe &&
        state.pendingAssignment &&
        state.pendingApproval
      ) {
        if (
          (el.primary_reviewers.includes(user.id) ||
            el.tertiary_reviewers.includes(user.id)) &&
          (el.status == UploadedDatasetStatusEnum.PENDING ||
            el.status ==
              UploadedDatasetStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW ||
            el.status == UploadedDatasetStatusEnum.PENDING_APPROVAL)
        ) {
          return true;
        }
      } else if (state.assignedToMe) {
        return (
          el.primary_reviewers.includes(user.id) ||
          el.tertiary_reviewers.includes(user.id)
        );
      } else if (state.pendingAssignment) {
        return (
          el.status == UploadedDatasetStatusEnum.PENDING ||
          el.status ==
            UploadedDatasetStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW
        );
      } else if (state.pendingApproval) {
        return el.status == UploadedDatasetStatusEnum.PENDING_APPROVAL;
      }
      if (
        !state.assignedToMe &&
        !state.pendingAssignment &&
        !state.pendingApproval
      ) {
        return true;
      }
      return false;
    });
    setFilteredDatasets([...filtered]);
  }, [state, uploadedDatasets, user.id]);

  return (
    <div style={{ width: '100%' }}>
      <main>
        <Typography variant="h5">Datasets</Typography>
        <>
          <DataGrid
            rows={filteredDatasets /*uploadedDatasets*/}
            columns={columns}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            slots={{
              toolbar: AddToolbar,
            }}
          />
          {selectedDataset && (
            <>
              {/* Render AssignReviewerDialog only when actionDialogOpen is true */}
              {actionDialogOpen && (
                <AssignReviewerDialog
                  open={actionDialogOpen}
                  onClose={handleDialogClose}
                  datasetId={selectedDataset.id}
                  assignmentType={assignmentType}
                />
              )}

              {/* Render RejectDialog only when rejectDialogOpen is true */}
              {rejectDialogOpen && (
                <RejectDialog
                  open={rejectDialogOpen}
                  onClose={handleCloseRejectDialog}
                  datasetId={selectedDataset.id}
                  rejectType={rejectType}
                />
              )}
            </>
          )}
          {isEmailPopupOpen && (
            <EmailPopup isOpen={isEmailPopupOpen} onClose={handleClosePopup} />
          )}
          {loading && <CircularProgress />}
        </>
      </main>
      <UploadedDatasetActionDialog
        isOpen={validateActionDialogOpen}
        datasetId={''}
        action={UploadedDatasetActionTypeEnum.ADHOC_VALIDATE}
        onOk={() => {
          // setActionType('');
          setValidateActionDialogOpen(false);
          // handleMenuClose();
        }}
        onCancel={() => {
          // setActionType('');
          setValidateActionDialogOpen(false);
          // handleMenuClose();
        }}
      />
    </div>
  );
};
