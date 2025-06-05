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
// import ModelActionTypeRenderer from '../shared/modelActionTypeRenderer';
import { UploadedModelActionTypeEnum } from '../../state/state.types';
import { formatDate } from '../../utils/utils';
import DateRenderer from '../shared/dateRenderer';
import { useTranslations } from 'next-intl';

interface IUploadedModelLog {
  id: string;
  action_type: string;
  action_date: Date;
  action_details: string;
  action_taker: string;
}

interface IModelLogListProps {
  modelId: string;
}

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  border: `1px solid ${theme.palette.error.main}`,
  // '&.Communication': {
  //   color: (theme.vars || theme).pallette.info.dark,
  //   border: `1px solid`
  // }
}));

const ActionTypeRenderer = ({ action_type }: { action_type: string }) => {
  const size = { width: 20, height: 20 };
  // 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning',

  let icon: any = null;

  const map: Record<string, any> = {
    [UploadedModelActionTypeEnum.NEW_UPLOAD.toString()]: (
      <DraftsIcon sx={size} color={'warning'} />
    ),
    [UploadedModelActionTypeEnum.APPROVE.toString()]: (
      <DoneAllIcon sx={size} color={'success'} />
    ),
    [UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS.toString()]: (
      <UploadIcon sx={size} color={'secondary'} />
    ),
    [UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS.toString()]: (
      <AssignmentIcon sx={size} color={'secondary'} />
    ),
    [UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW.toString()]: (
      <DoneIcon sx={size} color={'primary'} />
    ),
    [UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW.toString()]: (
      <DoneOutlineIcon sx={size} color={'primary'} />
    ),
    [UploadedModelActionTypeEnum.REJECT.toString()]: (
      <ReportProblemIcon sx={size} color={'error'} />
    ),
    [UploadedModelActionTypeEnum.SEND_EMAIL.toString()]: (
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

export const UploadedModelLogList = (props: IModelLogListProps) => {
  const logs = useAppSelector(
    (state) => state.uploadedModel.currentUploadedModel?.uploaded_model_log
  );

  const t = useTranslations('UploadedModelDetailPage');

  const columns: GridColDef[] = [
    // const columns: GridColDef<IUploadedModelLog>[] = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 40,
    // },
    {
      field: 'action_type',
      headerName: t('grid.actionType'),
      width: 250,
      editable: false,
      // renderCell: ({ row }) => (
      //   // <ActionTypeRenderer action_type={row.action_type} />
      //   <ModelActionTypeRenderer actionType={row.action_type} />
      // ),
    },
    {
      field: 'action_date',
      headerName: t('grid.actionDate'),
      type: 'date',
      width: 150,
      editable: false,
      valueGetter: (params) => {
        return new Date(params.row.action_date);
      },
      // valueFormatter: (params) => {
      //   return formatDate(params.value, false, false); // new Date(params.value).toLocaleDateString();
      // },
      renderCell: ({ row }) => <DateRenderer value={row.action_date} />,
    },
    {
      field: 'action_details',
      headerName: t('grid.details'),
      type: 'string',
      width: 400,
      editable: false,
      renderCell: ({ row }) => (
        <div
          dangerouslySetInnerHTML={{
            __html: row.action_details?.toString() || '',
          }}
        />
      ),
    },
    // {
    //   field: 'action_taker',
    //   headerName: 'Performed by',
    //   type: 'string',
    //   width: 200,
    //   editable: false,
    // },
  ];

  return (
    <div>
      <DataGrid
        columns={columns}
        rows={logs || []}
        // slots={{
        //   toolbar: GridToolbar,
        // }}
        pageSizeOptions={[25]}
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
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
      />
    </div>
  );
};
