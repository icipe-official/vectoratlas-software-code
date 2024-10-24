import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Container,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import SectionPanel from '../layout/sectionPanel';
import AuthWrapper from '../shared/AuthWrapper';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { useRouter } from 'next/router';
import { getCommunicationLog } from '../../state/communicationLog/actions/communicationLog.actions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { ApproveRejectDialog } from '../shared/approveRejectDialog';
import { StatusRenderer } from '../shared/StatusRenderer';

const APPROVE: string = 'Approve';
const REJECT: string = 'Reject';

interface DisplayItemProps {
  label: string;
  value: string;
  isHtml?: boolean;
}

const DisplayItem = (props: DisplayItemProps) => {
  return (
    <Grid2
      container
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'flex-start' }}
    >
      <Grid2 xs={4} sx={{ padding: 2 }}>
        <FormLabel filled color="error" sx={{ fontWeight: 'bold' }}>
          {props.label}
        </FormLabel>
      </Grid2>
      <Grid2 xs={8}>
        {props.isHtml && (
          <div dangerouslySetInnerHTML={{ __html: props.value }} />
        )}
        {!props.isHtml && <FormLabel>{props.value}</FormLabel>}
      </Grid2>
    </Grid2>
  );
};

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

const CommunicationLogDetails = () => {
  const dispatch = useAppDispatch();
  const communicationLog = useAppSelector(
    (state) => state.communicationLog.currentCommunicationLog
  );
  const loading = useAppSelector((state) => state.communicationLog.loading);
  const isAdmin = useAppSelector((state) => state.auth.roles.includes('admin'));
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // const handleAction = async (formValues: object) => {
  //   if (!id) {
  //     return;
  //   }
  //   const comments = formValues?.comments?.replace(/\"/g, '\\"');
  //   const recipients = formValues?.recipients;
  //   debugger;
  //   if (actionType == APPROVE) {
  //     await dispatch(
  //       approveDoiById({ id: id, comments: comments, recipients: recipients })
  //     );
  //     await dispatch(getDOI(id));
  //     toast.success('DOI approved');
  //   }
  //   if (actionType == REJECT) {
  //     await dispatch(
  //       rejectDoiById({ id: id, comments: comments, recipients: recipients })
  //     );
  //     await dispatch(getDOI(id));
  //     toast.success('DOI rejected');
  //   }
  // };

  useEffect(() => {
    if (id) {
      dispatch(getCommunicationLog(id));
    }
  }, [id, dispatch]);
  return (
    <div>
      <main>
        <Typography variant="h5" color="primary">
          Communication Details
        </Typography>
        {/* <AuthWrapper role="admin"> */}
        <Card variant="outlined" sx={{ padding: 1, margin: 0, border: 'none' }}>
          <CardHeader
            avatar={
              <Grid2
                container
                spacing={2}
                sx={{ alignItems: 'center', justifyContent: 'flex-start' }}
              >
                <Grid2 sx={{ padding: 1 }}>
                  <Typography variant="h6">
                    {communicationLog?.subject}
                  </Typography>
                </Grid2>
                <Grid2>
                  <StatusRenderer
                    status={communicationLog?.sent_status || ''}
                  />
                </Grid2>
                <Grid2 sx={{ padding: 1 }}>
                  <Typography variant="caption">
                    {communicationLog?.sent_status}
                  </Typography>
                </Grid2>
              </Grid2>
            }
            action={
              <div>
                {communicationLog?.sent_status == 'Pending' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setActionType(APPROVE);
                      setActionDialogOpen(true);
                    }}
                  >
                    Resend
                  </Button>
                )}
              </div>
            }
          />
        </Card>

        <Card
          sx={
            {
              /*maxWidth: 345*/
            }
          }
        >
          <CardContent>
            <Box sx={{ flexGrow: 1 }}>
              <DisplayItem
                label="Message Type"
                value={communicationLog?.message_type || ''}
              />
              <DisplayItem
                label="Channel Type"
                value={communicationLog?.channel_type || ''}
              />
              <DisplayItem
                label="Sent Status"
                value={communicationLog?.sent_status || ''}
              />
              <DisplayItem
                label="Recipients"
                value={communicationLog?.recipients || ''}
              />
            </Box>
          </CardContent>
          <CardActions disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <DisplayItem label="Message" value={communicationLog?.message} />
              <DisplayItem
                label="Reference Entity Type"
                value={communicationLog?.reference_entity_type || ''}
              />
              <DisplayItem
                label="Reference Entity Name"
                value={communicationLog?.reference_entity_name || ''}
              />
               <DisplayItem
                label="Sent Date"
                value={communicationLog?.sent_date}
              />
              <DisplayItem
                label="Sent Response"
                value={communicationLog?.sent_response || ''}
              /> 
            </CardContent>
          </Collapse>
        </Card>
        {/* </AuthWrapper> */}
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
      </main>
    </div>
  );
};

export default CommunicationLogDetails;
