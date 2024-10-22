import React, { useEffect, useState } from 'react';
import { Button, Link, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import AssignReviewerDialog from './AssignReviewerDialog';
import { fetchAllUsers, fetchUploadedDatasetList } from '../../api/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import UploadIcon from '@mui/icons-material/Upload';
import ClearIcon from '@mui/icons-material/Clear';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RejectDialog from './RejectDialog';
import EmailPopup from '../sendMail/sendMail';
import { Mail } from '@mui/icons-material';

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
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [assignmentType, setAssignmentType] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For menu handling
  const [selectedRow, setSelectedRow] = useState<any>(null); // Track the selected row
  const [rejectDialogOpen, setRejectDialogOpen] = useState<any>(null);
  const [rejectType, setRejectType] = useState<string>('');
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const router = useRouter();

  const handleOpenPopup = () => {
    setIsEmailPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsEmailPopupOpen(false);
  };

  const loadDatasets = async () => {
    const res: any[] = await fetchUploadedDatasetList();
    setData(res);
  };

  const loadUsers = async () => {
    const res: any[] = await fetchAllUsers();
    setUsers(res);
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
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    loadDatasets();
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    loadDatasets();
  };

  useEffect(() => {
    loadUsers();
    loadDatasets();
  }, []);

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Link onClick={() => router.push(`/uploaded-dataset/details?id=${params.row.id}`)}>
          {params.row.title}
        </Link>
      ),
    },
    {
      field: 'last_upload_date',
      headerName: 'Uploaded On',
      type: 'dateTime',
      width: 130,
      valueGetter: (params: any) => new Date(params.row.last_upload_date),
      valueFormatter: (params: any) => new Date(params.value).toLocaleDateString(),
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
              {status === 'Pending' && users.some(user => user.is_reviewer_manager) && (
                <>
                  <MenuItem
                    onClick={() => {
                      setDialogOpen(true);
                      setSelectedDatasetId(params.row.id);
                      setAssignmentType('primaryReview');
                      handleMenuClose();
                    }}
                  >
                    <AssignmentIcon fontSize="small" /> Assign Primary Reviewer
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
                  <MenuItem onClick={() => {
                    setSelectedDatasetId(params.row.id),
                      handleDatasetReject();
                    setRejectType("beforeApproval");
                  }}>
                    <ClearIcon fontSize="small" /> Reject
                  </MenuItem>
                  <MenuItem onClick={handleOpenPopup}>
                    <Mail fontSize="small" /> Send Email
                  </MenuItem>
                </>
              )}
              {status === 'PendingTertiaryAssignment' && users.some(user => user.is_reviewer_manager) && (
                <>
                  <MenuItem
                    onClick={() => {
                      setDialogOpen(true);
                      setSelectedDatasetId(params.row.id);
                      setAssignmentType('tertiaryReview');
                      handleMenuClose();
                    }}
                  >
                    <AssignmentIcon fontSize="small" /> Assign Tertiary Reviewer
                  </MenuItem>
                  <MenuItem onClick={handleOpenPopup}>
                    <Mail fontSize="small" /> Send Email
                  </MenuItem>
                </>
              )}
              {status === 'Tertiary Review' && (
                <>
                  <MenuItem onClick={handleMenuClose}>
                    <UploadIcon fontSize="small" /> Send Upload
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setSelectedDatasetId(params.row.id),
                      handleDatasetReject();
                    setRejectType("afterApproval");
                  }}>
                    <ClearIcon fontSize="small" /> Reject
                  </MenuItem>
                  <MenuItem onClick={handleOpenPopup}>
                    <Mail fontSize="small" /> Send Email
                  </MenuItem>
                </>
              )}
              {status === 'Pending Approval' && users.some(user => user.is_reviewer_manager) && (
                <>
                  <MenuItem onClick={handleMenuClose}>
                    <CheckIcon fontSize="small" /> Approve
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

        <DataGrid
          rows={data}
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
        />
        {selectedDatasetId && (
          <>
            {/* Render AssignReviewerDialog only when dialogOpen is true */}
            {dialogOpen && (
              <AssignReviewerDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                datasetId={selectedDatasetId}
                assignmentType={assignmentType}
              />
            )}

            {/* Render RejectDialog only when rejectDialogOpen is true */}
            {rejectDialogOpen && (
              <RejectDialog
                open={rejectDialogOpen}
                onClose={handleCloseRejectDialog}
                datasetId={selectedDatasetId}
                rejectType={rejectType}
              />
            )}
          </>
        )}
        {isEmailPopupOpen && (
          <EmailPopup isOpen={isEmailPopupOpen}
            onClose={handleClosePopup}
          />
        )
        }
      </main>
    </div>
  );
};
