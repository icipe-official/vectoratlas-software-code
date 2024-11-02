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
import theme from '../../styles/theme';
import { UploadedDatasetActionTypeEnum } from '../../state/state.types';

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
let icon: any = null;

const actionMap = {
  [UploadedDatasetActionTypeEnum.NEW_UPLOAD]: {
    icon: <DraftsIcon sx={size} color={theme.palette.warning.main} />,
    color: theme.palette.warning.main,
  },
  [UploadedDatasetActionTypeEnum.APPROVE]: {
    icon: <DoneAllIcon sx={size} color={theme.palette.success.main} />,
    color: theme.palette.success.main,
  },

  [UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS]: {
    icon: <AssignmentIcon sx={size} color={theme.palette.info.main} />,
    color: theme.palette.info.main,
  },
  [UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS]: {
    icon: <AssignmentIcon sx={size} color={theme.palette.info.main} />,
    color: theme.palette.info.dark,
  },
  [UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW]: {
    icon: <DoneIcon sx={size} color={theme.palette.success.main} />,
    color: theme.palette.success.dark,
  },
  [UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW]: {
    icon: <DoneOutlineIcon sx={size} color={theme.palette.success.dark} />,
    color: theme.palette.success.dark,
  },
  [UploadedDatasetActionTypeEnum.REJECT]: {
    icon: <ReportProblemIcon sx={size} color={theme.palette.error.main} />,
    color: theme.palette.error.main,
  },
  [UploadedDatasetActionTypeEnum.SEND_EMAIL]: {
    icon: <MessageIcon sx={size} color={'info'} />,
    color: theme.palette.info.main,
  },
};

const DatasetActionTypeRenderer = (props: actionTypeRendererProps) => {
  return (
    <StyledChip
      icon={actionMap[props.actionType]?.icon}
      size="small"
      label={props.actionType}
      variant="outlined"
      color={actionMap[props.actionType]?.color}
      //   sx={{
      //     //border: `1px solid ${actionMap[props.actionType]?.color}`,
      //     border: `1px solid error`,
      //   }}
    />
  );
};

export default DatasetActionTypeRenderer;
