import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Container,
  Link,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { StatusRenderer } from '../shared/StatusRenderer';
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
import { StatusEnum, UploadedDatasetStatusEnum } from '../../state/state.types';

interface EditToolbarProps {
  // setRows: (newRows: )
}

function AddToolbar(props: EditToolbarProps) {
  return (
    <GridToolbarContainer
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button
        color="primary"
        startIcon={<AddIcon />}
        // onClick={handleUploadDataset}
        href="/upload"
      >
        Upload new dataset
      </Button>

      <Button
        color="primary"
        startIcon={<AddIcon />}
        // onClick={handleUploadDataset}
        href="/upload"
      >
        Actions
      </Button>
    </GridToolbarContainer>
  );
}

export const UploadedDatasetList = () => {
  interface IUser {
    auth0_id: string;
    is_uploader: boolean;
    is_reviewer: boolean;
    is_admin: boolean;
    is_editor: boolean;
    is_reviewer_manager: boolean | null;
  }

  const [dialogOpen, setDialogOpen] = useState(false);
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

  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.uploadedDataset.loading);
  const selectedDataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );
  const uploadedDatasets = useAppSelector(
    (state) => state.uploadedDataset.uploadedDatasets
  );

  const loadDatasets = async () => {
    await dispatch(getUploadedDatasets());
  };

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
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDatasetReject = () => {
    setRejectDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <Link
          onClick={() => {
            router.push({
              pathname: '/uploaded-dataset',
              query: { id: params.value },
            });
          }}
        >
          {params.value}
        </Link>
      ),
      valueGetter: (params) => {
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
      width: 130,
      valueGetter: (params: any) => new Date(params.row.last_upload_date),
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'primary_reviewers',
      headerName: 'Primary Reviewer Email',
      type: 'string',
      width: 200,
    },
    {
      field: 'tertiary_reviewers',
      headerName: 'Tertiary Reviewer Email',
      type: 'string',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'string',
      width: 150,

      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <StatusRenderer status={params.value} title={params.value} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.row.status;

        return (
          <>
            <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedRow?.id === params.row.id}
              onClose={handleMenuClose}
            >
              {status === 'Pending' &&
                users.some((user) => user.is_reviewer_manager) && (
                  <>
                    <MenuItem
                      onClick={() => {
                        setDialogOpen(true);
                        setSelectedDatasetId(params.row.id);
                        setAssignmentType('primaryReview');
                        handleMenuClose();
                      }}
                    >
                      <AssignmentIcon fontSize="small" /> Assign Primary
                      Reviewer
                    </MenuItem>
                    <MenuItem onClick={handleOpenPopup}>
                      <Mail fontSize="small" /> Send Email
                    </MenuItem>
                  </>
                )}
              {status === 'Primary Review' && (
                <>
                  <MenuItem onClick={handleMenuClose}>
                    <UploadIcon fontSize="small" /> First Upload
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSelectedDatasetId(params.row.id),
                        handleDatasetReject();
                      setRejectType('beforeApproval');
                    }}
                  >
                    <ClearIcon fontSize="small" /> Reject
                  </MenuItem>
                  <MenuItem onClick={handleOpenPopup}>
                    <Mail fontSize="small" /> Send Email
                  </MenuItem>
                </>
              )}
              {status === 'PendingTertiaryAssignment' &&
                users.some((user) => user.is_reviewer_manager) && (
                  <>
                    <MenuItem
                      onClick={() => {
                        setDialogOpen(true);
                        setSelectedDatasetId(params.row.id);
                        setAssignmentType('tertiaryReview');
                        handleMenuClose();
                      }}
                    >
                      <AssignmentIcon fontSize="small" /> Assign Tertiary
                      Reviewer
                    </MenuItem>
                    <MenuItem onClick={handleOpenPopup}>
                      <Mail fontSize="small" /> Send Email
                    </MenuItem>
                  </>
                )}
              {status === 'Tertiary Review' && (
                <>
                  <MenuItem onClick={handleMenuClose}>
                    <UploadIcon fontSize="small" /> Second Upload
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSelectedDatasetId(params.row.id),
                        handleDatasetReject();
                      setRejectType('afterApproval');
                    }}
                  >
                    <ClearIcon fontSize="small" /> Reject
                  </MenuItem>
                  <MenuItem onClick={handleOpenPopup}>
                    <Mail fontSize="small" /> Send Email
                  </MenuItem>
                </>
              )}
              {status === 'Pending Approval' &&
                users.some((user) => user.is_reviewer_manager) && (
                  <>
                    <MenuItem onClick={handleMenuClose}>
                      <CheckIcon fontSize="small" /> Approve
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSelectedDatasetId(params.row.id),
                          handleDatasetReject();
                        setRejectType('afterApproval');
                      }}
                    >
                      <ClearIcon fontSize="small" /> Reject
                    </MenuItem>
                    <MenuItem onClick={handleOpenPopup}>
                      <Mail fontSize="small" /> Send Email
                    </MenuItem>
                  </>
                )}
            </Menu>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <main>
        <Typography variant="h5">Datasets</Typography>
        {/* <AuthWrapper role="editor">
                    <NewsEditor />
                  </AuthWrapper> */}
        <DataGrid
          rows={uploadedDatasets}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          slots={{
            toolbar: AddToolbar,
          }}
        />
        {selectedDataset && (
          <>
            {/* Render AssignReviewerDialog only when dialogOpen is true */}
            {dialogOpen && (
              <AssignReviewerDialog
                open={dialogOpen}
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
      </main>
    </div>
  );
};
