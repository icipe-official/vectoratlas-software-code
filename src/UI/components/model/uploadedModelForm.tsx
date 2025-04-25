import {
  Box,
  Button,
  Container,
  FormLabel,
  InputProps,
  CircularProgress,
  Card,
  CardContent,
  Link,
  Checkbox,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import CloudDownload from '@mui/icons-material/CloudDownload';
import { SaveOutlined } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
// import { downloadModelFile } from '../../api/api';
import {
  downloadModelFile,
  getUploadedModel,
} from '../../state/uploadedModel/actions/uploaded-model.action';
import { useRouter } from 'next/router';
import React from 'react';
import { CustomizedSnackBar } from '../shared/CustomizedSnackBar';
import {
  ActionAssignees,
  ApproveRejectDialog,
} from '../shared/approveRejectDialog';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { StatusRenderer } from '../shared/statusRenderer';
import { ModelFileType, RolesEnum } from '../../state/state.types';
import { extractFileNameFromBlobUrl } from '../../utils/utils';
import { fetchAllUsersDetails } from '../../api/api';

const ASSIGN: string = 'Assign';
const APPROVE: string = 'Approve';
const REVIEW: string = 'Review';
const REJECT: string = 'Reject';
const VALIDATE: string = 'Validate';

const ACTION_TYPES = [APPROVE, REJECT, VALIDATE];

type UploadedModelProps = {
  // is_new_upload?: boolean;
  modelId: string;
};

interface DisplayItemProps {
  label: string;
  value: string | React.ReactNode;
  isHtml?: boolean;
  isComponent?: boolean;
}

interface DisplayFileProps {
  modelId: string;
  label: string;
  url: string;
  fileType: ModelFileType;
}

const getFileName = (filePath: string) => {
  const res = extractFileNameFromBlobUrl(filePath);
  if (res.indexOf('/') != -1) {
    return res.split('/')[1];
  }
  return res;
};

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
      {!props.isComponent && (
        <Grid2 xs={8}>
          {props.isHtml && (
            <div
              dangerouslySetInnerHTML={{
                __html: props?.value?.toString() || '',
              }}
            />
          )}
          {!props.isHtml && <FormLabel>{props.value}</FormLabel>}
        </Grid2>
      )}
      {props.isComponent && <Grid2 xs={8}>{props.value}</Grid2>}
    </Grid2>
  );
};

const DisplayFile = ({ modelId, fileType, label, url }: DisplayFileProps) => {
  const dispatch = useAppDispatch();
  const doDownload = async () => {
    dispatch(downloadModelFile({ modelId, fileType }));
  };
  return (
    <DisplayItem
      label={label}
      isComponent
      value={
        <Button
          component="label"
          role={undefined}
          startIcon={<CloudDownload />}
          sx={{ textTransform: 'none' }}
          onClick={doDownload}
        >
          {getFileName(url)}
        </Button>
        // <Link
        //   // href={url}
        //   onClick={doDownload}
        // >
        //   {url.split('/').pop()}
        // </Link>
      }
    />
  );
};

const UploadedModelForm = (props: UploadedModelProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isInternalUser =
    (userRoles || []).includes(RolesEnum.ADMIN) ||
    (userRoles || []).includes(RolesEnum.REVIEWER) ||
    (userRoles || []).includes(RolesEnum.REVIEWER_MANAGER);

  const [autoHideDuration, setAutoHideDuration] = useState(6000);
  const [approveAlertOpen, setApproveAlertOpen] = useState(false);
  const [rejectAlertOpen, setRejectAlertOpen] = useState(false);
  const [validateAlertOpen, setValidateAlertOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const [modelId, setModelId] = useState(props.modelId || '');
  // const [model, setModel] = useState(null);

  const [readonly, setReadOnly] = useState<boolean>(true);

  const [actionType, setActionType] = useState('');

  const [primaryReviewers, setPrimaryReviewers] = useState<string[]>([]);
  const [tertiaryReviewers, setTertiaryReviewers] = useState<string[]>([]);
  const [reassignedTertiaryReviewers, setReassignedTertiaryReviewers] =
    useState<string[]>([]);

  const uploadedModel = useAppSelector(
    (state) => state.uploadedModel.currentUploadedModel
  );
  const loading = useAppSelector((state) => state.uploadedModel.loading);
  const downloading = useAppSelector(
    (state) => state.uploadedModel.downloading
  );
  const token = useAppSelector((state) => state.auth.token);

  const handleCloseActionsMenu = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    actionName: string,
    selectedIdx: number
  ) => {
    setSelectedIndex(selectedIdx);
    setActionType(actionName);
    setApproveAlertOpen(true);
    setActionDialogOpen(true);
  };

  const handleAction = async (formValues: ActionAssignees) => {
    // const comments = formValues?.comments || '';
    // if (actionType == APPROVE) {
    //   dispatch(approveUploadedModel({ modelId, comments }));
    // }
    // if (actionType == REVIEW) {
    //   dispatch(reviewUploadedModel({ modelId, comments }));
    // }
    // if (actionType == REJECT) {
    //   dispatch(rejectUploadedModel({ modelId, comments }));
    // }
  };

  const handleSubmit = () => {
    setActionType('');
  };

  const getStatusIndicator = (status: string) => {
    let color = '#d9182e';
    switch (status) {
      case 'Pending':
        color = '#d9182e';
        break;
      case 'Approved':
        color = '#4caf50';
        break;

      case 'Under Review':
        color = '#ffa500';
        break;

      case 'Rejected':
        color = '#d9182e';
        break;
      case 'Rejected By Reviewer Manager':
        color = '#d9182e';
        break;
      default:
        break;
    }
    return color;
  };

  const inputProps: InputProps = {
    readOnly: readonly,
  };

  // Memoize the data value
  const memoizedPrimaryReviewers = useMemo(
    () => primaryReviewers,
    [primaryReviewers]
  );

  const memoizedTertiaryReviewers = useMemo(
    () => tertiaryReviewers,
    [tertiaryReviewers]
  );

  const memoizedReassignedTertiaryReviewers = useMemo(
    () => reassignedTertiaryReviewers,
    [reassignedTertiaryReviewers]
  );

  useEffect(() => {
    const getModel = async () => {
      if (modelId) {
        dispatch(getUploadedModel(modelId));
      }
      //setModel(res);
    };
    getModel();
  }, [dispatch, modelId]);

  useEffect(() => {
    const setEmails = async () => {
      let emails: string[] = [];
      for (const userId of uploadedModel?.primary_reviewers || []) {
        const res = await fetchAllUsersDetails(token, userId);
        if (res) {
          emails.push(res.name);
        }
      }
      setPrimaryReviewers(emails);

      emails = [];
      for (const userId of uploadedModel?.tertiary_reviewers || []) {
        const res = await fetchAllUsersDetails(token, userId);
        if (res) {
          emails.push(res.name);
        }
      }
      setTertiaryReviewers(emails);

      if (uploadedModel.is_tertiary_review_reassigned) {
        emails = [];
        for (const userId of uploadedModel?.reassigned_tertiary_reviewers ||
          []) {
          const res = await fetchAllUsersDetails(token, userId);
          if (res) {
            emails.push(res.name);
          }
        }
        setReassignedTertiaryReviewers(emails);
      }
    };
    setEmails();
  }, [
    token,
    uploadedModel.is_tertiary_review_reassigned,
    uploadedModel?.primary_reviewers,
    uploadedModel?.reassigned_tertiary_reviewers,
    uploadedModel?.tertiary_reviewers,
  ]);

  const SnackBarItems = () => {
    return (
      <div>
        <CustomizedSnackBar
          open={approveAlertOpen}
          message="Model approved"
          autoHideDuration={autoHideDuration}
          onClose={() => {}}
          updateParentStateHandler={() => setApproveAlertOpen(false)}
        />
        <CustomizedSnackBar
          open={rejectAlertOpen}
          message="Reject model"
          autoHideDuration={autoHideDuration}
          onClose={() => {}}
          updateParentStateHandler={() => setRejectAlertOpen(false)}
        />
        <CustomizedSnackBar
          open={validateAlertOpen}
          message="Validate model"
          autoHideDuration={autoHideDuration}
          onClose={() => {}}
          updateParentStateHandler={() => setValidateAlertOpen(false)}
        />
      </div>
    );
  };

  // const ToolbarItems = () => {
  //   return (
  //     <Box sx={{ flexGrow: 1 }}>
  //   <Grid2 container spacing={1}>
  //     <Grid2 size={4}>
  //     <TextField label="First Name" />
  //     </Grid2>
  //     <Grid2 size={4}>
  //     <TextField label="Last Name" />
  //     </Grid2>
  //   </Grid2></Box>
  //   )
  // };

  return (
    <div>
      <Container>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1 /*width: '100ch'*/ },
            maxWidth: '100%',
            bgcolor: '#fff',
          }}
          noValidate
          autoComplete="off"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <StatusRenderer
              status={uploadedModel?.status || ''}
              statusTitle={uploadedModel?.status}
              label={uploadedModel?.title}
            />
            {uploadedModel?.is_reupload_requested && (
              <StatusRenderer
                status={'Pending'}
                statusTitle={'Pending Model Reupload'}
                label={''}
              />
            )}
          </div>

          <Card>
            <CardContent>
              <Box sx={{ flexGrow: 1 }}>
                <DisplayItem
                  label="Model Title"
                  value={uploadedModel?.title || ''}
                  isHtml
                />
                <DisplayItem
                  label="Description"
                  value={uploadedModel?.description || ''}
                  isHtml
                />
                <DisplayItem
                  label="Authors"
                  value={uploadedModel?.author || ''}
                />
                <DisplayItem
                  label="Affiliated Institution"
                  value={uploadedModel?.affiliated_institution || ''}
                />
                <DisplayItem
                  label="Provided DOI"
                  value={uploadedModel?.provided_doi || ''}
                />
                <DisplayItem
                  label="Generate a DOI for this model"
                  isComponent
                  value={
                    <Checkbox
                      disabled
                      size="small"
                      checked={uploadedModel?.is_doi_requested}
                    />
                  }
                />
                {isInternalUser && (
                  <>
                    <DisplayItem
                      label="Primary Reviewer"
                      value={memoizedPrimaryReviewers.join(',')}
                    />
                    <DisplayItem
                      label="Tertiary Reviewer"
                      value={memoizedTertiaryReviewers.join(',')}
                    />
                  </>
                )}{' '}
                {isInternalUser &&
                  uploadedModel?.is_tertiary_review_reassigned && (
                    <>
                      <DisplayItem
                        label="Reassigned for tertiary review?"
                        isComponent
                        value={
                          <Checkbox
                            disabled
                            size="small"
                            checked={
                              uploadedModel?.is_tertiary_review_reassigned
                            }
                          />
                        }
                      />
                      <DisplayItem
                        label="Reassigned Tertiary Reviewer"
                        value={memoizedReassignedTertiaryReviewers.join(',')}
                      />
                    </>
                  )}
                {isInternalUser && uploadedModel?.uploaded_file_name && (
                  <DisplayFile
                    modelId={uploadedModel.id}
                    label="Original data"
                    url={uploadedModel.uploaded_file_name}
                    fileType={'Raw'}
                  />
                )}
                {isInternalUser &&
                  uploadedModel?.uploaded_file_name_primary_reviewed && (
                    <DisplayFile
                      modelId={uploadedModel.id}
                      label="Primary reviewed data"
                      url={uploadedModel.uploaded_file_name_primary_reviewed}
                      fileType={'Approved'}
                    />
                  )}
                {isInternalUser &&
                  uploadedModel?.uploaded_file_name_tertiary_reviewed && (
                    <DisplayFile
                      modelId={uploadedModel.id}
                      label="Tertiary reviewed data"
                      url={uploadedModel.uploaded_file_name_tertiary_reviewed}
                      fileType={'Approved'}
                    />
                  )}
                {uploadedModel?.doi && (
                  <DisplayItem
                    label="Model DOI"
                    isHtml
                    value={`<a href="${uploadedModel?.doi?.doi_link}" target="_blank"> ${uploadedModel?.doi?.doi_link}</a>`}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
          <div>
            {!readonly && (
              <Button
                // component="label"
                role={undefined}
                variant="contained"
                type="submit"
                startIcon={<SaveOutlined />}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </div>
          {
            /*ACTION_TYPES.includes(actionType) &&*/ <ApproveRejectDialog
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
          {loading && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              m
              <CircularProgress />
            </div>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default UploadedModelForm;
