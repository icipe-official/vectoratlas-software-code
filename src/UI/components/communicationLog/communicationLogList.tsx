import { Button, Link, Typography } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridValueFormatterParams,
  GridValueGetterParams,
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
  getCommunicationLog,
} from '../../state/communicationLog/actions/communicationLog.actions';
import { StatusRenderer } from '../shared/statusRenderer';
import DateRenderer from '../shared/dateRenderer';

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
  const [selectedCommunicationLogId, setSelectedCommunicationLogId] =
    useState('');
  const communicationLogList = useAppSelector(
    (state) => state.communicationLog.communicationLogs
  );

  // const columns: GridColDef<typeof rows[number]>[] = [
  const columns: GridColDef[] = [
    //const columns = [
    {
      field: 'subject',
      headerName: 'Subject',
      width: 330,
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
      valueGetter: (params: GridValueGetterParams) => {
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
      width: 200,
      editable: false,
    },
    {
      field: 'communication_date',
      headerName: 'Date',
      type: 'dateTime',
      width: 170,
      valueGetter: (params: any) => new Date(params.row.communication_date),
      renderCell: ({ row }: { row: any }) => (
        <DateRenderer value={row.communication_date} />
      ),
    },
    {
      field: 'sent_status',
      headerName: 'Status',
      type: 'string',
      width: 150,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <StatusRenderer status={params.value} statusTitle={params.value} />
      ),
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllCommunicationLogs());
    };
    loadData();
  }, [dispatch]);

  return (
    <>
      <div>
        <main>
          <div>
            <Typography variant="h5">Communication List</Typography>
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
              pageSizeOptions={[10]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(
                rowSelectionModel: GridRowSelectionModel,
                details: GridCallbackDetails
              ) => {
                if (!rowSelectionModel) {
                  setSelectedCommunicationLogId('');
                } else {
                  setSelectedCommunicationLogId(
                    rowSelectionModel?.[0]?.toString()
                  );
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
