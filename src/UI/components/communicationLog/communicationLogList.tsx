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
  getAllCommunicationLogs,
  getCommunicationLog
} from '../../state/communicationLog/actions/communicationLog.actions';
import { toast } from 'react-toastify';
import {
  getDOI,
  getAllDois,
} from '../../state/communicationLog/actions/communicationLog.actions';
import { StatusRenderer } from '../shared/StatusRenderer';
import { StatusEnum } from '../../state/state.types'; 
import { setCurrentCommunicationLog } from '../../state/communicationLog/communicationLogSlice';

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

export const CommunicationLogList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch(); 
  const [selectedCommunicationLogId, setSelectedCommunicationLogId] = useState('');
  const communicationLogList = useAppSelector(
    (state) => state.communicationLog.communicationLogs
  );

  const getActionButtons = (params) => {
    let actions = [
      // <GridActionsCellItem
      //   key={1}
      //   icon={<VisibilityIcon />}
      //   label="Details"
      //   onClick={() => {
      //     router.push({
      //       pathname: '/communication-log/details',
      //       query: { id: params.id },
      //     });
      //   }}
      // />,
    ];
    return actions;
  };

  // const columns: GridColDef<typeof rows[number]>[] = [
  const columns = [
    {
      field: 'subject',
      headerName: 'Subject',
      width: 250,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <Link
          // href={`/uploaded-dataset/details/${params.value}`}
          onClick={() => {
            router.push({
              pathname: '/communication-log/details',
              query: { id: params.value },
            });
          }}
        >
          {params.value}
        </Link>
      ),
      valueGetter: (params) => {
        return (
          <Link href={`/communication-log/details?id=${params.row.id}`}>
            {params.row.subject}
          </Link>
        );
      },
    },
    {
      field: 'message_type',
      headerName: 'Message Type',
      width: 150,
      editable: false,
    },
    {
      field: 'communication_date',
      headerName: 'Date',
      type: 'dateTime',
      width: 150,
      editable: false,
      valueGetter: (params) => {
        return new Date(params.row.communication_date);
      },
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    }, 
    // {
    //   field: 'creator_email',
    //   headerName: 'Email',
    //   width: 150,
    // },
    {
      field: 'sent_status',
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

  const loadCommunicationLogs = async () => {
    await dispatch(getAllCommunicationLogs());
  };

  useEffect(() => {
    const loadData = async () => {
      await loadCommunicationLogs();
    };
    loadData();
  }, []);

  return (
    <>
      <div>
        <main>
          <div>
            <Typography variant="h5">Communication List</Typography>
            {/* <AuthWrapper role="admin">
                    <NewsEditor />
                  </AuthWrapper> */}
            <DataGrid
              rows={communicationLogList}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
                // filter: {
                //   filterModel: {
                //     items: [
                //       {
                //         id: 1,
                //         field: 'sent_status',
                //         operator: 'equals',
                //         value: 'Pending',
                //       },
                //     ],
                //   },
                // },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(
                rowSelectionModel: GridRowSelectionModel,
                details: GridCallbackDetails
              ) => {
                if (!rowSelectionModel) {
                  setSelectedCommunicationLogId('');
                } else {
                  setSelectedCommunicationLogId(rowSelectionModel?.[0]?.toString());
                }
              }}
              slots={{
                toolbar: FilterToolbar, // AddToolbar,
              }}
            />
          </div>
        </main>
      </div>
    </>
  );
};
