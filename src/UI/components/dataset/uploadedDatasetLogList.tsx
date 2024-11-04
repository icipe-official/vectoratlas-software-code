import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { Box, Chip, FormLabel, styled, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CircleIcon from '@mui/icons-material/Circle'; 
import DoneIcon from '@mui/icons-material/Done';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DraftsIcon from '@mui/icons-material/Drafts';
import MessageIcon from '@mui/icons-material/Message';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import DatasetActionTypeRenderer from '../shared/datasetActionTypeRenderer';
import { UploadedDatasetActionTypeEnum } from '../../state/state.types';

interface IUploadedDataSetLog {
  id: string;
  action_type: string;
  action_date: Date;
  action_details: string;
  action_taker: string;
}

interface IDatasetLogListProps {
  datasetId: string;
}

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  border: `1px solid ${(theme.vars || theme).palette.error.main}`,
  // '&.Communication': {
  //   color: (theme.vars || theme).pallette.info.dark,
  //   border: `1px solid`
  // }
}));

const ActionTypeRenderer = ({ action_type }) => {
  const size = { width: 20, height: 20 };
  // 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning',

  let icon: any = null;

  const map = {
    [UploadedDatasetActionTypeEnum.NEW_UPLOAD]: (
      <DraftsIcon sx={size} color={'warning'} />
    ),
    [UploadedDatasetActionTypeEnum.APPROVE]: (
      <DoneAllIcon sx={size} color={'success'} />
    ),
    [UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS]: (
      <UploadIcon sx={size} color={'secondary'} />
    ),
    [UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS]: (
      <AssignmentIcon sx={size} color={'secondary'} />
    ),
    [UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW]: (
      <DoneIcon sx={size} color={'primary'} />
    ),
    [UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW]: (
      <DoneOutlineIcon sx={size} color={'primary'} />
    ),
    [UploadedDatasetActionTypeEnum.REJECT]: (
      <ReportProblemIcon sx={size} color={'error'} />
    ),
    [UploadedDatasetActionTypeEnum.SEND_EMAIL]: (
      <MessageIcon sx={size} color={'info'} />
    ),
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <UploadIcon sx={{ width: 10, height: 10 }} color={'red'} /> */}
      {/* {map[action_type]}
      <FormLabel sx={{ marginLeft: 1 }}>{action_type}</FormLabel> */}
      <StyledChip
        icon={map[action_type]}
        size="small"
        label={action_type}
        variant="outlined"
      />
    </Box>
  ); //<UploadIcon>{action_type}</UploadIcon>;
};

export const UploadedDatasetLogList = (props: IDatasetLogListProps) => {
  const logs = useAppSelector(
    (state) =>
      state.uploadedDataset.currentUploadedDataset?.uploaded_dataset_log
  );

  const columns: GridColDef<IUploadedDataSetLog>[] = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 40,
    // },
    {
      field: 'action_type',
      headerName: 'Action Type',
      width: 300,
      editable: false,
      renderCell: ({ row }) => (
        // <ActionTypeRenderer action_type={row.action_type} />
        <DatasetActionTypeRenderer actionType={row.action_type} />
      ),
    },
    {
      field: 'action_date',
      headerName: 'Action Date',
      type: 'date',
      width: 150,
      editable: false,
      valueGetter: (params) => {
        return new Date(params.row.action_date);
      },
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: 'action_details',
      headerName: 'Action Details',
      type: 'string',
      width: 400,
      editable: false,
      renderCell: ({ row }) => (
        <div dangerouslySetInnerHTML={{ __html: row.action_details }} />
      ),
    },
    {
      field: 'action_taker',
      headerName: 'Performed by',
      type: 'string',
      width: 200,
      editable: false,
    },
  ];

  return (
    <div>
      <DataGrid
        columns={columns}
        rows={logs || []}
        // slots={{
        //   toolbar: GridToolbar,
        // }}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  field: 'age',
                  operator: '>',
                  value: '20',
                },
              ],
            },
          },
        }}
      />
    </div>
  );
};
