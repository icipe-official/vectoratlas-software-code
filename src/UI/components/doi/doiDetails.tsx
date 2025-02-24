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
  TextField,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import SectionPanel from '../../components/layout/sectionPanel';
import AuthWrapper from '../shared/AuthWrapper';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { useRouter } from 'next/router';
import {
  getDOI,
  approveDoiById,
  rejectDoiById,
} from '../../state/doi/actions/doi.actions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import {
  ActionAssignees,
  ApproveRejectDialog,
} from '../shared/approveRejectDialog';
import { StatusRenderer } from '../shared/statusRenderer';
import { formatDate } from '../../utils/utils';
import { string } from 'yup';

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
          <div
            dangerouslySetInnerHTML={{ __html: props.value?.toString() || '' }}
          />
        )}
        {!props.isHtml && <FormLabel>{props.value}</FormLabel>}
      </Grid2>
    </Grid2>
  );
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

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
      props: ({ expand }: { expand: boolean }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }: { expand: boolean }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

const DoiDetails = () => {
  const dispatch = useAppDispatch();
  const doi = useAppSelector((state) => state.doi.currentDoi);
  const loading = useAppSelector((state) => state.doi.loading);
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

  const handleAction = async (formValues: ActionAssignees) => {
    if (!id) {
      return;
    }
    const comment = formValues?.comments?.replace(/\"/g, '\\"');
    const recipients = formValues?.recipients || undefined;
    if (actionType == APPROVE) {
      const res = await dispatch(
        approveDoiById({
          id: id,
          comments: comment?.toString() || '',
          recipients: recipients,
        })
      );
      if (res) {
        await dispatch(getDOI(id));
      }
    }
    if (actionType == REJECT) {
      await dispatch(
        rejectDoiById({
          id: id,
          comments: comment?.toString() || '',
          recipients: recipients,
        })
      );
      await dispatch(getDOI(id));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getDOI(id));
    }
  }, [id, dispatch]);
  return (
    <div>
      <main>
        <Typography variant="h5" color="primary">
          Doi Details
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
                  <Typography variant="h6">{doi?.title}</Typography>
                </Grid2>
                <Grid2>
                  <StatusRenderer status={doi?.approval_status || ''} />
                </Grid2>
                <Grid2 sx={{ padding: 1 }}>
                  <Typography variant="caption">
                    {doi?.approval_status}
                  </Typography>
                </Grid2>
              </Grid2>
            }
            action={
              <div>
                {doi?.approval_status == 'Pending' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setActionType(APPROVE);
                      setActionDialogOpen(true);
                    }}
                  >
                    Approve
                  </Button>
                )}
                {doi?.approval_status == 'Pending' && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setActionType(REJECT);
                      setActionDialogOpen(true);
                    }}
                  >
                    Reject
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
              {/* <DisplayItem
                label="Author Name"
                value={doi?.creator_name || ''}
              />
              <DisplayItem
                label="Author Email"
                value={doi?.creator_email || ''}
              /> */}
              {/* <DisplayItem label="Dataset" value={doi?.dataset?.title || ''} /> */}
              <DisplayItem label="Source Type" value={doi?.source_type || ''} />
              <DisplayItem
                label="DOI"
                isHtml
                value={`<a href="${doi?.doi_link}" target="_blank"> ${
                  doi?.doi_link || ''
                }</a>`}
              />
              <DisplayItem
                label="Authored On"
                value={formatDate(doi?.creation || '') || ''}
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
              <DisplayItem
                label="Publication Year"
                value={doi?.publication_year?.toString() || ''}
              />
              <DisplayItem
                label="Description"
                isHtml
                value={doi?.description || ''}
              />
              <DisplayItem
                label="Resolving URL"
                isHtml
                value={`<a href="${doi?.resolving_url}" target="_blank"> ${
                  doi?.resolving_url || ''
                }</a>`}
              />
              <DisplayItem label="Doi Id" value={doi?.doi_id || ''} />
              <DisplayItem
                label="Is Draft"
                value={doi?.is_draft ? 'True' : 'False'}
              />
              {/* <DisplayItem label="Uploaded Dataset" value={doi?.dataset || ''} /> */}
              <DisplayItem
                isHtml
                label="Approval/Reject Comm"
                value={doi?.comments || ''}
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
            onOk={(formValues: ActionAssignees) => {
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

export default DoiDetails;
