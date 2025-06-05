import React, {
  FormEventHandler,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadIcon from '@mui/icons-material/Upload';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import {
  adhocCommunication,
  getUploadedModels,
} from '../../state/uploadedModel/actions/uploaded-model.action';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { StatusRenderer } from '../shared/statusRenderer';
import { AppState } from '../../state/store';
import {
  fetchAllUsers,
  fetchAllUsersByRole,
  fetchAllUsersDetails,
} from '../../api/api';
import { marked } from 'marked';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import {
  setIsModelValid,
  setLoading,
  setValidationErrors,
} from '../../state/uploadedModel/uploadedModelSlice';
// import ValidateModelDialog from './validateModel';
import {
  RolesEnum,
  UploadedModelActionTypeEnum,
} from '../../state/state.types';
import { useTranslations } from 'next-intl';
// import ValidationErrorsView from './ValidationErrorsView';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface User {
  auth0_id: string;
  name: string;
  email: string;
}

interface UploadedModelActionDialogProps {
  action: UploadedModelActionTypeEnum;
  isOpen: boolean;
  modelId: string;
  onOk?: () => void;
  onCancel?: () => void;
}

export const UploadedModelActionDialog = (
  props: UploadedModelActionDialogProps
) => {
  const t = useTranslations('UploadedModelDetailPage');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingAssignees, setLoadingAssignees] = useState(true);
  const token = useAppSelector((state: AppState) => state.auth.token);
  const currentUser = useAppSelector((state: AppState) => state.auth.id);
  const [selectedUsers, setSelectedUsers] = useState<User[] | string[]>([]);
  const [defaultRecipients, setDefaultRecipients] = useState<User[]>([]);
  const [richComments, setRichComments] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const validationErrors = useAppSelector(
    (state) => state.uploadedModel.validationErrors
  );

  const labelMap = {
    [UploadedModelActionTypeEnum.NEW_UPLOAD.toString()]: t(
      'actionDialog.buttons.upload'
    ),
    [UploadedModelActionTypeEnum.UPDATE.toString()]: t(
      'actionDialog.buttons.update'
    ),
    [UploadedModelActionTypeEnum.REUPLOAD.toString()]: t(
      'actionDialog.buttons.reUpload'
    ),
    [UploadedModelActionTypeEnum.SEND_EMAIL.toString()]: t(
      'actionDialog.buttons.send'
    ),
    [UploadedModelActionTypeEnum.APPROVE.toString()]: t(
      'actionDialog.buttons.approve'
    ),
    [UploadedModelActionTypeEnum.REJECT.toString()]: t(
      'actionDialog.buttons.reject'
    ),
    [UploadedModelActionTypeEnum.REVIEW.toString()]: t(
      'actionDialog.buttons.review'
    ),
    [UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS.toString()]: t(
      'actionDialog.buttons.assign'
    ),
    [UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS.toString()]: t(
      'actionDialog.buttons.assign'
    ),
    [UploadedModelActionTypeEnum.REASSIGN_TERTIARY_REVIEWERS.toString()]: t(
      'actionDialog.buttons.assign'
    ),
    [UploadedModelActionTypeEnum.REJECT_RAW.toString()]: t(
      'actionDialog.buttons.reject'
    ),
    [UploadedModelActionTypeEnum.REJECT_REVIEWED.toString()]: t(
      'actionDialog.buttons.reject'
    ),
    [UploadedModelActionTypeEnum.GENERATE_DOI.toString()]: t(
      'actionDialog.buttons.generateDoi'
    ),
    [UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW.toString()]: t(
      'actionDialog.buttons.complete'
    ),
    [UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW.toString()]: t(
      'actionDialog.buttons.complete'
    ),
    [UploadedModelActionTypeEnum.VALIDATE.toString()]: t(
      'actionDialog.buttons.validate'
    ),
    [UploadedModelActionTypeEnum.ADHOC_VALIDATE.toString()]: t(
      'actionDialog.buttons.validate'
    ),
    [UploadedModelActionTypeEnum.REQUEST_REUPLOAD.toString()]: t(
      'actionDialog.buttons.send'
    ),
    [UploadedModelActionTypeEnum.VIEW_MAP.toString()]: t(
      'actionDialog.buttons.viewMap'
    ),
    [UploadedModelActionTypeEnum.VIEW_DETAILS.toString()]: t(
      'actionDialog.buttons.viewDetails'
    ),
  };

  const isModelValid = useAppSelector(
    (state) => state.uploadedModel.isModelValid
  );
  const [uploadError, setUploadError] = useState(false);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);

  const allowExternalEmails =
    UploadedModelActionTypeEnum.SEND_EMAIL == props.action;
  const allowMultipleFiles =
    UploadedModelActionTypeEnum.SEND_EMAIL == props.action;
  const isValidatingContext =
    props.action == UploadedModelActionTypeEnum.VALIDATE ||
    props.action == UploadedModelActionTypeEnum.ADHOC_VALIDATE;
  const model = useAppSelector(
    (state) => state.uploadedModel.currentUploadedModel
  );
  const loading = useAppSelector((state) => state.uploadedModel.loading);
  const isProcessingAction = useAppSelector(
    (state) => state.uploadedModel.isProcessingAction
  );

  // const validateModelRef = useRef<typeof ValidateModelDialog>(null);

  const handleCancel = () => {
    props?.onCancel?.();
    resetContent();
    hideDialog();
  };

  const handleOk = () => {
    props?.onOk?.();
    resetContent();
    hideDialog();
  };

  const resetContent = () => {
    setSelectedUsers([]);
    setAttachedFiles([]);
    setRichComments('');
    dispatch(setValidationErrors({}));
    dispatch(setIsModelValid(undefined));
    dispatch(setLoading(false));
  };

  const hideDialog = () => {
    setIsOpen(false);
  };

  const allowUpload = () => {
    return [
      UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW,
      UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW,
      UploadedModelActionTypeEnum.SEND_EMAIL,
    ].includes(props.action);
  };

  const enforceUpload = useCallback(() => {
    const res = [
      UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW,
      UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW,
    ].includes(props.action);
    return res;
  }, [props.action]);

  const enforceRecipients = () => {
    return [
      UploadedModelActionTypeEnum.SEND_EMAIL,
      UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS,
      UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS,
      UploadedModelActionTypeEnum.REASSIGN_TERTIARY_REVIEWERS,
    ].includes(props.action);
  };

  const fetchUsers = useCallback(
    async (role: string) => {
      setLoadingAssignees(true);
      const users: User[] = [];
      try {
        const response = await fetchAllUsersByRole(role);
        for (const entry of response) {
          const res = await fetchAllUsersDetails(token, entry.auth0_id);
          if (res) {
            users.push({
              auth0_id: res.user_id,
              name: res.name,
              email: res.email,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoadingAssignees(false);
      return users;
    },
    [token]
  );

  const redirectOnSuccess = () => {
    router.push({
      pathname: '/uploaded-model',
    });
  };

  const handleAction = async (data: FormData) => {
    const comments: any = data.get('comments') || '';
    const assignees: any = data.get('recipients') || [];
    const files: any = data.get('files') || null;
    // @TODO implement redirect on action. See https://medium.com/@ofir3322/redirect-on-action-strategy-using-redux-b5db14269f8c
    // if (
    //   props.action == UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS
    // ) {
    //   await dispatch(
    //     assignPrimaryReviewers({
    //       modelId: model.id,
    //       comments: comments,
    //       assignees: assignees,
    //     })
    //   );
    // }
    // if (
    //   props.action == UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS
    // ) {
    //   await dispatch(
    //     assignTertiaryReviewers({
    //       modelId: model.id,
    //       comments: comments,
    //       assignees: assignees,
    //       isReassignment: false,
    //     })
    //   );
    // }
    // if (
    //   props.action == UploadedModelActionTypeEnum.REASSIGN_TERTIARY_REVIEWERS
    // ) {
    //   await dispatch(
    //     assignTertiaryReviewers({
    //       modelId: model.id,
    //       comments: comments,
    //       assignees: assignees,
    //       isReassignment: true,
    //     })
    //   );
    // }
    if (props.action == UploadedModelActionTypeEnum.APPROVE) {
      // const resp = await dispatch(
      //   approveUploadedModel({
      //     modelId: model.id,
      //     comments: comments,
      //   })
      // );
    }
    // if (props.action == UploadedModelActionTypeEnum.REJECT) {
    //   await dispatch(
    //     rejectUploadedModel({
    //       modelId: model.id,
    //       comments: comments,
    //     })
    //   );
    // }

    // if (props.action == UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW) {
    //   await dispatch(
    //     completePrimaryReview({
    //       modelId: model.id,
    //       files: files,
    //       comments: comments,
    //     })
    //   );
    // }

    // if (
    //   props.action == UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW
    // ) {
    //   await dispatch(
    //     completeTertiaryReview({
    //       modelId: model.id,
    //       files: files,
    //       comments: comments,
    //     })
    //   );
    // }

    if (props.action == UploadedModelActionTypeEnum.SEND_EMAIL) {
      await dispatch(
        adhocCommunication({
          modelId: model.id,
          message: comments,
          recipients: assignees,
          files: files,
        })
      );
    }

    // if (props.action == UploadedModelActionTypeEnum.VALIDATE) {
    //   await dispatch(
    //     validateModel({
    //       modelId: model.id,
    //     })
    //   );
    // }

    // if (props.action == UploadedModelActionTypeEnum.ADHOC_VALIDATE) {
    //   await dispatch(
    //     adhocValidateModel({
    //       files: files,
    //     })
    //   );
    // }

    // if (props.action == UploadedModelActionTypeEnum.REQUEST_REUPLOAD) {
    //   await dispatch(
    //     requestModelReupload({
    //       modelId: model.id,
    //       comments,
    //     })
    //   );
    // }

    // we could be approving and errors were thrown. So do not close but display errors
    if (Object.keys(validationErrors || {}).length > 0) {
      return;
    }
    if (
      props.action == UploadedModelActionTypeEnum.VALIDATE ||
      props.action == UploadedModelActionTypeEnum.ADHOC_VALIDATE ||
      (props.action == UploadedModelActionTypeEnum.APPROVE &&
        isModelValid === false)
    ) {
      // for validations and approval do not close dialog since we may show errors
    } else {
      await dispatch(getUploadedModels());
      handleOk();
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files) {
      setAttachedFiles(Array.from(event.target.files));
    }
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    const getDefaultRecipients = async () => {
      const makeUploaderUser = async () => {
        const uploader = await fetchAllUsersDetails(token, currentUser);
        return {
          auth0_id: uploader.user_id,
          name: uploader.name,
          email: uploader.email,
        };
      };

      let recipients: User[] = [];
      if (!props.action) {
        setUsers([]);
        return;
      }

      if (
        props.action == UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS ||
        props.action == UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS ||
        props.action == UploadedModelActionTypeEnum.REASSIGN_TERTIARY_REVIEWERS
      ) {
        recipients = await fetchUsers(RolesEnum.REVIEWER);
      }

      if (props.action == UploadedModelActionTypeEnum.APPROVE) {
        recipients = await fetchUsers(RolesEnum.REVIEWER); //notify all reviewers
        recipients.push(...(await fetchUsers(RolesEnum.REVIEWER_MANAGER))); //notify all managers
        recipients.push(await makeUploaderUser()); //notify the uploader
      }

      if (
        props.action == UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW ||
        props.action == UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW
      ) {
        recipients.push(...(await fetchUsers(RolesEnum.REVIEWER_MANAGER))); //notify all managers
      }

      if (props.action == UploadedModelActionTypeEnum.REJECT) {
        recipients.push(await makeUploaderUser()); //notify the uploader
      }
      let unique = recipients.filter(
        (value, index, array) => array.indexOf(value) === index
      );
      setUsers(unique);
      setDefaultRecipients(unique);
      return recipients;
    };
    getDefaultRecipients();
  }, [props.action, model, token, fetchUsers, currentUser]);

  const onOk = async () => {
    console.log('Submitting....');
    //event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    // const formJson = Object.fromEntries((formData as any).entries());
    // formJson['recipients'] = selectedUsers?.map((usr) => usr.email);
    // formJson['comments'] = richComments; //formJson.comments;
    // // props.onOk(formJson);
    // if (isValidatingContext) {
    //   //@TODO revert this
    //   validateModelRef?.current?.validate();
    //   return;
    // }

    if (enforceRecipients() && selectedUsers.length == 0) {
      toast.error(
        //'You must specify the recipients. If you have typed the recipient emails, remember to press the Enter key after typing each email address'
        t('actionDialog.errors.invalidRecipients')
      );
      return;
    }
    if (enforceUpload() && attachedFiles.length == 0) {
      toast.error(
        //'You must attach a file'
        t('actionDialog.errors.attachFile')
      );
      return;
    }
    const formData = new FormData();
    const commentsHtml = await marked(richComments);

    selectedUsers?.map((usr: User | string) => {
      // formData.append('recipients', usr?.auth0_id || usr?.email);
      if (typeof usr === 'string') {
        formData.append('recipients', usr as string);
      } else {
        formData.append('recipients', usr?.auth0_id || usr?.email);
      }
    });
    // formData.append(
    //   'recipients',
    //   selectedUsers?.map((usr: any) => usr?.email)
    // );
    formData.append('comments', richComments /*commentsHtml*/);
    attachedFiles.forEach((file) => {
      formData.append('files', file);
    });
    handleAction(formData); // formJson['recipients'], formJson['comments']);
    // hideDialog();
  };

  useEffect(() => {
    if (enforceUpload() && attachedFiles.length === 0) {
      setUploadError(true);
    } else {
      setUploadError(false);
    }
  }, [attachedFiles, enforceUpload]);

  return (
    <Fragment>
      <Dialog
        open={isOpen}
        onClose={handleCancel}
        PaperProps={{
          elevation: 4,
          // component: 'form',
          onSubmit: async (
            event: any /* React.FormEvent<HTMLFormElement>*/
          ) => {
            console.log('Submitting....');
            event.preventDefault();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries((formData as any).entries());
            // formJson['recipients'] = selectedUsers?.map((usr) => usr.email);
            // formJson['comments'] = richComments; //formJson.comments;
            // // props.onOk(formJson);
            // if (isValidatingContext) {
            //   //@TODO revert this
            //   validateModelRef?.current?.validate();
            //   return;
            // }

            if (enforceRecipients() && selectedUsers.length == 0) {
              toast.error(
                //'You must specify the recipients. If you have typed the recipient emails, remember to press the Enter key after typing each email address'
                t('actionDialog.errors.invalidRecipients')
              );
              return;
            }
            if (enforceUpload() && attachedFiles.length == 0) {
              toast.error(
                //'You must attach a file',
                t('actionDialog.errors.attachFile')
              );
              return;
            }
            const formData = new FormData();
            const commentsHtml = await marked(richComments);

            selectedUsers?.map((usr: User | string) => {
              if (typeof usr === 'string') {
                formData.append('recipients', usr as string);
              } else {
                formData.append('recipients', usr?.auth0_id || usr.email);
              }
            });
            formData.append('comments', richComments);
            attachedFiles.forEach((file) => {
              formData.append('files', file);
            });
            handleAction(formData);
            // hideDialog();
          },
        }}
      >
        <DialogTitle>
          <StatusRenderer status={props.action} statusTitle={props.action} />
        </DialogTitle>
        {isValidatingContext /* || Object.keys(validationErrors || {}).length > 0*/ && (
          <>
            {/* <DialogContent>
              <ValidateModelDialog
                modelId={model?.id}
                ref={validateModelRef}
                validationType={props.action}
              />
            </DialogContent> */}
          </>
        )}
        {!isValidatingContext && (
          <DialogContent>
            {enforceRecipients() && (
              <div>
                <FormLabel>
                  {props.action == UploadedModelActionTypeEnum.SEND_EMAIL
                    ? t('actionDialog.recipients')
                    : t('actionDialog.assignees')}
                </FormLabel>
                {allowExternalEmails && (
                  <>
                    <br />
                    <Typography variant="caption" style={{ color: 'maroon' }}>
                      {t('actionDialog.externalEmailHelp')}
                    </Typography>
                    <br />
                  </>
                )}
                <Autocomplete
                  multiple
                  loading={loadingAssignees && !allowExternalEmails}
                  options={users}
                  freeSolo={allowExternalEmails}
                  getOptionLabel={(option: string | User) => {
                    if (typeof option === 'string') {
                      return option.toString();
                    } else {
                      return option.name;
                    }
                  }}
                  onChange={(event, newValue: any) => {
                    if (!allowExternalEmails) {
                      setSelectedUsers(newValue);
                    } else {
                      const usrs: User[] = [];
                      const emailErrors: string[] = [];
                      newValue?.map((el: string | User) => {
                        if (typeof el === 'string' && !emailRegex.test(el)) {
                          emailErrors.push(el);
                        } else {
                          usrs.push({
                            auth0_id: '',
                            name: el?.toString(),
                            email: el?.toString(),
                          });
                        }
                      });
                      setSelectedUsers(usrs);
                      setInvalidEmails(emailErrors);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // label="Select Recipients"
                      variant="outlined"
                      // onKeyDown={(e) => {
                      //   if (
                      //     /*e.code === 'enter'*/ e.code === 'Comma' &&
                      //     e.target.value
                      //   ) {
                      //     setUsers(users.concat(e.target.value));
                      //     // setAutoCompleteValue(
                      //     //   autoCompleteValue.concat(e.target.value)
                      //     // );
                      //   }
                      // }}
                    />
                  )}
                />
                <FormHelperText style={{ color: 'red' }}>
                  {invalidEmails.length > 0
                    ? `${t(
                        'actionDialog.errors.invalidEmails'
                      )}: ${invalidEmails.join(', ')}`
                    : ''}
                </FormHelperText>
                <br />
              </div>
            )}
            <DialogContentText>{t('actionDialog.comments')}</DialogContentText>
            <ReactQuill
              value={richComments}
              onChange={(val) => setRichComments(val)}
              placeholder={t('actionDialog.commentsPlaceholder')}
              // style={{ minHeight: '300px' }}
              theme="snow"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  [{ header: '1' }, { header: '2' }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ align: [] }],
                  [
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { indent: '-1' },
                    { indent: '+1' },
                  ],
                  [{ color: [] }, { background: [] }],
                  ['image' /*, 'link'*/, 'clean'],
                ],
              }}
              formats={[
                'header',
                'bold',
                'italic',
                'underline',
                'strike',
                'list',
                'bullet',
                'link',
                'indent',
                'align',
                'image',
                'color',
                'background',
              ]}
            />
            {/* {props.action == UploadedModelActionTypeEnum.APPROVE &&
              isModelValid === false && <ValidationErrorsView />} */}
            {/* <ValidationErrorsView /> */}
            {allowUpload() && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="text"
                  component="label"
                  sx={{
                    marginLeft: '14px',
                    color: uploadError ? 'red' : '', // Apply red border if error state is true,
                    borderColor: 'red', // uploadError ? 'red' : '', // Apply red border if error state is true
                  }}
                >
                  <UploadIcon />
                  {t('actionDialog.attachFile')}
                  <input
                    type="file"
                    hidden
                    multiple={allowMultipleFiles}
                    onChange={handleFileUpload}
                    accept=".xlsx, .xls, .csv"
                  />
                </Button>
                <Box mt={1}>
                  {attachedFiles.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() =>
                        setAttachedFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      sx={{
                        marginRight: 1,
                        marginBottom: 1,
                        fontSize: 'small',
                      }}
                    />
                  ))}
                </Box>
              </div>
            )}
          </DialogContent>
        )}
        {isProcessingAction && (
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <CircularProgress />
          </div>
        )}
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            // type="submit"
            variant="contained"
            color="primary"
            onClick={onOk}
            disabled={isProcessingAction}
            startIcon={<SaveIcon />}
          >
            {labelMap[props?.action?.toString()]}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={isProcessingAction}
          >
            {t('actionDialog.buttons.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
