import {
  Avatar,
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import DateRenderer from '../shared/dateRenderer';
import { useTranslations } from 'next-intl';

const APPROVE: string = 'Approve';
const REJECT: string = 'Reject';

interface DisplayItemProps {
  label: string;
  value: string | React.ReactNode;
  isHtml?: boolean;
  isComponent?: boolean;
}

// One label/value row with a faded line underneath (none after the last row)
const DisplayItem = (props: DisplayItemProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.5,
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)',
        },
        '&:last-child::after': {
          display: 'none',
        },
      }}
    >
      <FormLabel
        filled
        color="error"
        sx={{
          flex: '0 0 40%',
          minWidth: 0,
          fontWeight: 'bold',
          overflowWrap: 'anywhere',
        }}
      >
        {props.label}
      </FormLabel>

      <Box sx={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
        {props.isComponent ? (
          props.value
        ) : props.isHtml ? (
          <div
            dangerouslySetInnerHTML={{
              __html: props?.value?.toString() || '',
            }}
          />
        ) : (
          <FormLabel>{props.value}</FormLabel>
        )}
      </Box>
    </Box>
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
  const t = useTranslations('DoiDetailPage');
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

  // Go back if there is history to return to; otherwise (e.g. the page was opened
  // directly from a link) go to the DOI list
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/doi');
    }
  };

  const handleAction = async (formValues: ActionAssignees) => {
    if (!id) {
      return;
    }
    const comment = formValues?.comments?.replace(/\"/g, '\\"');
    const recipients = formValues?.recipients || undefined;
    if (actionType == APPROVE) {
      await dispatch(
        approveDoiById({
          id: id,
          comments: comment?.toString() || '',
          recipients: recipients,
        })
      );
      await dispatch(getDOI(id));
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
        {/* Back button, boxed and coloured to match the other buttons */}
        <Box
          sx={{
            display: 'inline-flex',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ px: 1.5, py: 0.5, borderRadius: 0 }}
          >
            Back to DOI List
          </Button>
        </Box>

        {/* Title and buttons: stacked on phones, side by side from sm up */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            sx={{ width: { xs: '100%', sm: '60%' } }}
          >
            {t('title')}
          </Typography>

          <CardHeader
            sx={{ p: 0, mt: { xs: 0, sm: -2.5 } }}
            action={
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {doi?.approval_status == 'Pending' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setActionType(APPROVE);
                      setActionDialogOpen(true);
                    }}
                  >
                    {t('buttons.approve')}
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
                    {t('buttons.reject')}
                  </Button>
                )}
              </Box>
            }
          />
        </Box>

        {/* <AuthWrapper role="admin"> */}
        <Card
          variant="outlined"
          sx={{ p: { xs: 0.5, sm: 1 }, m: 0, border: 'none' }}
        >
          <CardHeader
            sx={{ p: { xs: 1, sm: 2 } }}
            avatar={
              <Grid2
                container
                spacing={2}
                sx={{ alignItems: 'center', justifyContent: 'flex-start' }}
              >
                <Grid2 sx={{ padding: 1 }}>
                  <Typography variant="h6" sx={{ overflowWrap: 'anywhere' }}>
                    {doi?.title}
                  </Typography>
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
          />
        </Card>

        <Card sx={{ width: '100%', minWidth: 0 }}>
          <CardContent
            sx={{
              p: { xs: 1.5, sm: 2 },
              '&:last-child': { pb: { xs: 1.5, sm: 2 } },
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              {/* <DisplayItem
                label="Author Name"
                value={doi?.creator_name || ''}
              />
              <DisplayItem
                label="Author Email"
                value={doi?.creator_email || ''}
              /> */}
              {/* <DisplayItem label="Dataset" value={doi?.dataset?.title || ''} /> */}
              <DisplayItem
                label={t('sourceType')}
                value={doi?.source_type || ''}
              />
              {doi?.source_type == 'Upload' && (
                <DisplayItem
                  label={t('uploadedDataset')}
                  isHtml
                  value={`<a href="/uploaded-dataset/${
                    doi?.uploaded_dataset?.id
                  }" target="_blank"> ${doi?.title || ''}</a>`}
                />
              )}

              {doi?.approval_status == 'Approved' && (
                <DisplayItem
                  label={t('doi')}
                  isHtml
                  value={`<a href="${doi?.doi_link}" target="_blank"> ${
                    doi?.doi_link || ''
                  }</a>`}
                />
              )}

              <DisplayItem
                label={t('publicationYear')}
                value={doi?.publication_year?.toString() || ''}
              />
              <DisplayItem
                label={t('isPublished')}
                isComponent
                value={
                  <Checkbox
                    disabled
                    size="small"
                    checked={!(doi?.is_draft || true)}
                  />
                }
              />

              {doi?.source_type == 'Download' && (
                <DisplayItem
                  label={t('filters')}
                  value={
                    doi?.meta_data?.filters
                      ? JSON.stringify(doi?.meta_data?.filters)
                      : ''
                  }
                />
              )}

              <DisplayItem
                isHtml
                label={t('comment')}
                value={doi?.comments || ''}
              />
              <DisplayItem
                label={t('createdOn')}
                value={<DateRenderer value={doi?.creation || ''} />}
              />
              {doi?.approval_status == 'Approved' && (
                <DisplayItem
                  label={t('approvedOn')}
                  value={<DateRenderer value={doi?.status_updated_on || ''} />}
                />
              )}
            </Box>
          </CardContent>
          {/* <CardActions disableSpacing>
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
              {doi?.doi_link && (
                <DisplayItem label="DOI Link" value={doi?.doi_link} />
              )}

              <DisplayItem
                isHtml
                label="Approval/Reject Comm"
                value={doi?.comments || ''}
              />
            </CardContent>
          </Collapse> */}
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
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
          // onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </main>
    </div>
  );
};

export default DoiDetails;
