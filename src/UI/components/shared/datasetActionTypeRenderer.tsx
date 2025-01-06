import { Chip, styled } from '@mui/material';
import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DraftsIcon from '@mui/icons-material/Drafts';
import MessageIcon from '@mui/icons-material/Message';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import UploadIcon from '@mui/icons-material/Upload';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import theme from '../../styles/theme';
import { UploadedDatasetActionTypeEnum } from '../../state/state.types';
import { OverridableStringUnion } from '@mui/types';

interface actionTypeRendererProps {
  actionType: string;
}

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop: string) => !['color'].includes(prop),
})(({ theme, color }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  color,
  border: `1px solid ${color}`,
  //   border: `1px solid ${(theme.vars || theme).palette.error.main}`,
  // '&.Communication': {
  //   color: (theme.vars || theme).pallette.info.dark,
  //   border: `1px solid`
  // }
}));

const size = { width: 20, height: 20 };

const colorOptions: OverridableStringUnion<
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = 'default';

const actionMap = {
  [UploadedDatasetActionTypeEnum.NEW_UPLOAD.toString()]: {
    icon: (
      <DraftsIcon
        sx={size}
        color="primary"
        // color={theme.palette.warning.main}
      />
    ),
    color: 'primary', //theme.palette.warning.main,
  },
  [UploadedDatasetActionTypeEnum.APPROVE.toString()]: {
    icon: (
      <DoneAllIcon
        sx={size}
        color="success"
        // color={theme.palette.success.main}
      />
    ),
    color: 'success', // theme.palette.success.main,
  },

  [UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS.toString()]: {
    icon: (
      <AssignmentIcon
        sx={size}
        color="info"
        // color={theme.palette.info.main}
      />
    ),
    color: 'info', // theme.palette.info.main,
  },
  [UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS.toString()]: {
    icon: (
      <AssignmentIcon
        sx={size}
        color="info"
        //color={theme.palette.info.main}
      />
    ),
    color: theme.palette.info.dark,
  },
  [UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW.toString()]: {
    icon: (
      <DoneIcon
        sx={size}
        color="success"
        // color={theme.palette.success.main}
      />
    ),
    color: 'success', // theme.palette.success.dark,
  },
  [UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW.toString()]: {
    icon: (
      <DoneOutlineIcon
        sx={size}
        color="success"
        // color={theme.palette.success.dark}
      />
    ),
    color: 'success', //  theme.palette.success.dark,
  },
  [UploadedDatasetActionTypeEnum.REJECT.toString()]: {
    icon: (
      <ReportProblemIcon
        sx={size}
        color="error"
        // color={theme.palette.error.main}
      />
    ),
    color: 'error', // theme.palette.error.main,
  },
  [UploadedDatasetActionTypeEnum.SEND_EMAIL.toString()]: {
    icon: <MessageIcon sx={size} color="info" />,
    color: theme.palette.info.main,
  },
  [UploadedDatasetActionTypeEnum.REQUEST_REUPLOAD.toString()]: {
    icon: (
      <RequestQuoteIcon
        sx={size}
        color="warning"
        // color={theme.palette.warning.main}
      />
    ),
    color: 'warning', //  theme.palette.warning.main,
  },
};

const DatasetActionTypeRenderer = (props: actionTypeRendererProps) => {
  const entry = actionMap[props?.actionType];
  // const color: OverridableStringUnion<
  //   | 'default'
  //   | 'primary'
  //   | 'secondary'
  //   | 'error'
  //   | 'info'
  //   | 'success'
  //   | 'warning'
  // > = entry.color;
  //@TODO revert this
  const color = 'primary';
  return (
    <StyledChip
      icon={entry?.icon}
      size="small"
      label={props.actionType}
      variant="outlined"
      color={color || 'default'}
      //   sx={{
      //     //border: `1px solid ${actionMap[props.actionType]?.color}`,
      //     border: `1px solid error`,
      //   }}
    />
  );
};

export default DatasetActionTypeRenderer;
