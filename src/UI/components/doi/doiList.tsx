import { Button, Link, Typography } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridCallbackDetails,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { fetchDoiList, fetchUploadedDatasetList } from '../../api/api';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ApproveRejectDialog } from '../shared/approveRejectDialog';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  approveDOIById,
  rejectDOIById,
} from '../../state/doi/actions/doi.actions';
import { toast } from 'react-toastify';
import { getDOI, getAllDois } from '../../state/doi/actions/doi.actions';
import { StatusRenderer } from '../shared/StatusRenderer';

interface IDoiRequest {
  id: string;
  creation: Date;
  creator_name: string;
  creator_email: string;
  title: string;
  approval_status: string;
}

const APPROVE: string = 'Approve';
const REJECT: string = 'Reject';

function AddToolbar() {
  return (
    <GridToolbarContainer
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      {/* <Button color="primary" startIcon={<AddIcon />} onClick={() => {}}>
        Approve
      </Button>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        // onClick={handleUploadDataset}
        href="/upload"
      >
        Reject
      </Button> */}
    </GridToolbarContainer>
  );
}

function FilterToolbar() {
  return (
    <div>
      <GridToolbarFilterButton />
    </div>
  );
}

export const DoiList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedDoi, setSelectedDoi] = useState('');
  const doiList = useAppSelector((state) => state.doi.dois);

  const getActionButtons = (params) => {
    let actions = [
      <GridActionsCellItem
        key={1}
        icon={<VisibilityIcon />}
        label="Details"
        onClick={() => {
          router.push({
            pathname: '/doi/details',
            query: { id: params.id },
          });
        }}
      />,
    ];
    if (params.row.approval_status == 'Pending') {
      actions = actions.concat([
        <GridActionsCellItem
          key={2}
          icon={<CheckCircleIcon />}
          label="Approve"
          showInMenu
          onClick={() => {
            setActionType(APPROVE);
            setSelectedDoi(params.id);
            setActionDialogOpen(true);
          }}
        />,
        <GridActionsCellItem
          key={3}
          icon={<CancelIcon />}
          label="Reject"
          showInMenu
          onClick={() => {
            setActionType(REJECT);
            setSelectedDoi(params.row.id);
            setActionDialogOpen(true);
          }}
        />,
      ]);
    }
    return actions;
  };

  // const columns: GridColDef<typeof rows[number]>[] = [
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <Link
          // href={`/uploaded-dataset/details/${params.value}`}
          onClick={() => {
            router.push({
              pathname: '/doi/details',
              query: { id: params.value },
            });
          }}
        >
          {params.value}
        </Link>
      ),
      valueGetter: (params) => {
        return (
          <Link href={`/doi/details?id=${params.row.id}`}>
            {params.row.title}
          </Link>
        );
      },
    },
    {
      field: 'creator_name',
      headerName: 'Creator',
      width: 150,
      editable: false,
    },
    // {
    //   field: 'creator_email',
    //   headerName: 'Email',
    //   width: 150,
    // },
    {
      field: 'creation',
      headerName: 'Created On',
      type: 'dateTime',
      width: 150,
      editable: false,
      valueGetter: (params) => {
        return new Date(params.row.creation);
      },
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: 'approval_status',
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
      type: 'actions',
      width: 80,
      getActions: (params) => getActionButtons(params),
    },
  ];

  // const [data, setData] = useState(new Array<IDoiRequest>());

  const loadDOIs = async () => {
    await dispatch(getAllDois());
  };

  useEffect(() => {
    const loadData = async () => {
      await loadDOIs();
    };
    loadData();
  }, []);

  const handleAction = async (formValues: object) => {
    if (!selectedDoi) {
      return;
    }
    const comments = formValues?.comments;
    if (actionType == APPROVE) {
      await dispatch(approveDOIById({ id: selectedDoi, comments: comments }));
      await loadDOIs();
      toast.success('DOI approved');
    }
    if (actionType == REJECT) {
      await dispatch(rejectDOIById({ id: selectedDoi, comments: comments }));
      await loadDOIs();
      toast.success('DOI rejected');
    }
  };

  return (
    <>
      <div>
        <main>
          <div>
            <Typography variant="h5">DOI List</Typography>
            {/* <AuthWrapper role="admin">
                    <NewsEditor />
                  </AuthWrapper> */}
            <DataGrid
              rows={doiList}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
                filter: {
                  filterModel: {
                    items: [
                      {
                        id: 1,
                        field: 'approval_status',
                        operator: 'equals',
                        value: 'Pending',
                      },
                    ],
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(
                rowSelectionModel: GridRowSelectionModel,
                details: GridCallbackDetails
              ) => {
                if (!rowSelectionModel) {
                  setSelectedDoi('');
                } else {
                  setSelectedDoi(rowSelectionModel?.[0]?.toString());
                }
              }}
              slots={{
                toolbar: FilterToolbar,// AddToolbar,
              }}
            />
            {
              <ApproveRejectDialog
                isApprove={actionType == APPROVE}
                title={actionType}
                isOpen={actionDialogOpen}
                onOk={(formValues: object) => {
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
          </div>
        </main>
      </div>
    </>
  );
};
