import React, { useEffect, useState } from 'react';
import { Button, Link, Typography } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridToolbarContainer } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import AssignReviewerDialog from './AssignReviewerDialog';
import { fetchAllUsers, fetchUploadedDatasetList } from '../../api/api';
import AddIcon from '@mui/icons-material/Add';

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

  const router = useRouter();

  const loadDatasets = async () => {
    const res: any[] = await fetchUploadedDatasetList();
    setData(res);
  };

  const loadUsers = async () => {
    const res: any[] = await fetchAllUsers();
    setUsers(res);
  };

  // Refetch datasets when the dialog is closed
  const handleDialogClose = () => {
    setDialogOpen(false);
    loadDatasets(); // Reload datasets when the dialog is closed
  };

  //fetch users
  useEffect(() => {
    loadUsers();
  }, []);

  // Initial fetch of datasets
  useEffect(() => {
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
      field: 'provided_doi',
      headerName: 'Provided DOI',
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
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.row.status;

        return (
          <div>
            {status === 'Pending' && users.some(user => user.is_reviewer_manager) && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setDialogOpen(true);
                  setSelectedDatasetId(params.row.id);
                  setAssignmentType('primaryReview');
                }}
              >
                Assign Primary Reviewer
              </Button>
            )}
            {status === 'Primary Review' && (
              <Button variant="contained" color="primary">
                First Upload
              </Button>
            )}
            {status === 'PendingTertiaryAssignment' && users.some(user => user.is_reviewer_manager) && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setDialogOpen(true);
                  setSelectedDatasetId(params.row.id);
                  setAssignmentType('tertiaryReview');
                }}
              >
                Assign Tertiary Reviewer
              </Button>
            )}
            {status === 'Tertiary Review' && (
              <Button variant="contained" color="secondary">
                Second Upload
              </Button>
            )}
            {status === 'Pending Approval' && users.some(user => user.is_reviewer_manager) && (
              <Button variant="contained" color="secondary">
                Approve
              </Button>
            )}
          </div>
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

        <AssignReviewerDialog
          open={dialogOpen}
          onClose={handleDialogClose} // Close the modal and reload data
          datasetId={selectedDatasetId} // Pass the dataset ID to the modal
          assignmentType={assignmentType}
        />
      </main>
    </div>
  );
};
