import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { useAppSelector } from '../../state/hooks';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DoneIcon from '@mui/icons-material/Done';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DraftsIcon from '@mui/icons-material/Drafts';
import MessageIcon from '@mui/icons-material/Message';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { UploadedModelActionTypeEnum } from '../../state/state.types';
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
}));

// Icon shown beside each action type
const getActionIcon = (actionType: string) => {
  const size = { width: 20, height: 20 };
  const map: Record<string, React.ReactElement> = {
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
  return map[actionType] ?? null;
};

// One card per log entry, used on phones
const LogCard = ({ log }: { log: IUploadedModelLog }) => {
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack spacing={1}>
          <Box>
            <StyledChip
              icon={getActionIcon(log.action_type)}
              size="small"
              label={log.action_type}
              variant="outlined"
            />
          </Box>

          <Box>
            <Typography
              component="div"
              sx={{
                fontSize: '0.7rem',
                color: 'text.secondary',
                lineHeight: 1.2,
              }}
            >
              Date
            </Typography>
            <Typography component="div" sx={{ fontSize: '0.85rem' }}>
              <DateRenderer value={log.action_date} />
            </Typography>
          </Box>

          <Box>
            <Typography
              component="div"
              sx={{
                fontSize: '0.7rem',
                color: 'text.secondary',
                lineHeight: 1.2,
              }}
            >
              Details
            </Typography>
            <Typography
              component="div"
              sx={{
                fontSize: '0.85rem',
                lineHeight: 1.35,
                overflowWrap: 'anywhere',
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: log.action_details?.toString() || '',
                }}
              />
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const UploadedModelLogList = (props: IModelLogListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const logs = useAppSelector(
    (state) => state.uploadedModel.currentUploadedModel?.uploaded_model_log
  ) as IUploadedModelLog[] | undefined;

  const t = useTranslations('UploadedModelDetailPage');

  const columns: GridColDef[] = [
    {
      field: 'action_type',
      headerName: t('grid.actionType'),
      width: 250,
      editable: false,
      renderCell: ({ row }) => (
        <StyledChip
          icon={getActionIcon(row.action_type)}
          size="small"
          label={row.action_type}
          variant="outlined"
        />
      ),
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
  ];

  // Phones: one card per entry, so nothing is squeezed or scrolled sideways
  if (isMobile) {
    if (!logs || logs.length === 0) {
      return null;
    }
    return (
      <Stack spacing={1.5} sx={{ px: 1.5, py: 1.5 }}>
        {logs.map((log) => (
          <LogCard key={log.id} log={log} />
        ))}
      </Stack>
    );
  }

  // Larger screens: the original table
  return (
    <div>
      <DataGrid
        columns={columns}
        rows={logs || []}
        pageSizeOptions={[25]}
        initialState={{
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
