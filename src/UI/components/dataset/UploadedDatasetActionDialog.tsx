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
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import {
  adhocCommunication,
  approveUploadedDataset,
  assignPrimaryReviewers,
  assignTertiaryReviewers,
  completePrimaryReview,
  completeTertiaryReview,
  rejectUploadedDataset,
  validateDataset,
  adhocValidateDataset,
  requestDatasetReupload,
  getUploadedDatasets,
} from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { StatusRenderer } from '../shared/statusRenderer';
import { AppState } from '../../state/store';
import { fetchAllUsersByRole, fetchAllUsersDetails } from '../../api/api';
import { marked } from 'marked';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import {
  setIsDatasetValid,
  setLoading,
  setValidationErrors,
} from '../../state/uploadedDataset/uploadedDatasetSlice';
import ValidateDatasetDialog from './validateDataset';
import { UploadedDatasetActionTypeEnum } from '../../state/state.types';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface User {
  auth0_id: string;
  name: string;
  email: string;
}

interface UploadedDatasetActionDialogProps {
  action: UploadedDatasetActionTypeEnum;
  isOpen: boolean;
  datasetId: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const labelMap = {
  [UploadedDatasetActionTypeEnum.NEW_UPLOAD.toString()]: 'Upload',
  [UploadedDatasetActionTypeEnum.UPDATE.toString()]: 'Update',
  [UploadedDatasetActionTypeEnum.REUPLOAD.toString()]: 'Re-upload',
  [UploadedDatasetActionTypeEnum.SEND_EMAIL.toString()]: 'Send',
  [UploadedDatasetActionTypeEnum.APPROVE.toString()]: 'Approve',
  [UploadedDatasetActionTypeEnum.REJECT.toString()]: 'Reject',
  [UploadedDatasetActionTypeEnum.REVIEW.toString()]: 'Review',
  [UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS.toString()]: 'Assign',
  [UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS.toString()]:
    'Assign',
  [UploadedDatasetActionTypeEnum.REJECT_RAW.toString()]: 'Reject',
  [UploadedDatasetActionTypeEnum.REJECT_REVIEWED.toString()]: 'Reject',
  [UploadedDatasetActionTypeEnum.GENERATE_DOI.toString()]: 'Generate Doi',
  [UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW.toString()]:
    'Complete',
  [UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW.toString()]:
    'Complete',
  [UploadedDatasetActionTypeEnum.VALIDATE.toString()]: 'Validate',
  [UploadedDatasetActionTypeEnum.ADHOC_VALIDATE.toString()]: 'Validate',
  [UploadedDatasetActionTypeEnum.REQUEST_REUPLOAD.toString()]: 'Send',
  [UploadedDatasetActionTypeEnum.VIEW_MAP.toString()]: 'View Map',
  [UploadedDatasetActionTypeEnum.VIEW_DETAILS.toString()]: 'View Details',
};

export const UploadedDatasetActionDialog = (
  props: UploadedDatasetActionDialogProps
) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [users, setUsers] = useState<User[]>([]);
  const token = useAppSelector((state: AppState) => state.auth.token);
  const [selectedUsers, setSelectedUsers] = useState<User[] | string[]>([]);
  const [defaultRecipients, setDefaultRecipients] = useState<User[]>([]);
  const [richComments, setRichComments] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const validationErrors = useAppSelector(
    (state) => state.uploadedDataset.validationErrors
  );
  const allowExternalEmails =
    UploadedDatasetActionTypeEnum.SEND_EMAIL == props.action;
  const allowMultipleFiles =
    UploadedDatasetActionTypeEnum.SEND_EMAIL == props.action;
  const isValidatingContext =
    props.action == UploadedDatasetActionTypeEnum.VALIDATE ||
    props.action == UploadedDatasetActionTypeEnum.ADHOC_VALIDATE;
  const dataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );
  const loading = useAppSelector((state) => state.uploadedDataset.loading);
  const isProcessingAction = useAppSelector(
    (state) => state.uploadedDataset.isProcessingAction
  );
  const validateDatasetRef = useRef<typeof ValidateDatasetDialog>(null);

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
    dispatch(setIsDatasetValid(false));
    dispatch(setLoading(false));
  };

  const hideDialog = () => {
    setIsOpen(false);
  };

  const allowUpload = () => {
    return [
      UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW,
      UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW,
      UploadedDatasetActionTypeEnum.SEND_EMAIL,
    ].includes(props.action);
  };

  const enforceUpload = () => {
    return [
      UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW,
      UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW,
    ].includes(props.action);
  };

  const enforceRecipients = () => {
    return [
      UploadedDatasetActionTypeEnum.SEND_EMAIL,
      UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS,
      UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS,
    ].includes(props.action);
  };

  const fetchUsers = useCallback(
    async (role: string) => {
      const users: User[] = [];
      try {
        const response = await fetchAllUsersByRole(role);

        if (response && response.length > 0) {
          // Fetch full user details for each reviewer using their auth0_id
          const userDetailsPromises = response.map(async (user: any) => {
            const userDetails = await fetchAllUsersDetails(
              token,
              user.auth0_id
            );
            return {
              ...user,
              ...userDetails,
            };
          });

          if (userDetailsPromises) {
            // Wait for all promises to resolve
            const fullUserDetails: User[] = await Promise.all(
              userDetailsPromises
            );
            // Set the state with full user details
            // setUsers(fullUserDetails);
            users.push(...fullUserDetails);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        const dummyUsers = [
          {
            auth0_id: 'google-oauth2|114640128305555424834',
            name: 'Steve Nyaga',
            email: 'stevenyaga@gmail.com',
          },
          {
            auth0_id: 'google-oauth2|111569057650528982505',
            name: 'Lovestrant Kemboi',
            email: 'lkemboi@icipe.org',
          },
          {
            auth0_id: 'auth0|633d223bd2c75a12885805a8',
            name: 'Mandela Mitau',
            email: 'mmuithi@icipe.org',
          },
          {
            auth0_id: 'auth0|633d223bd2c75a12885805a8',
            name: 'Mandela Mitau',
            email: 'mmuithi@icipe.org',
          },
        ];
        users.push(...dummyUsers);
      }
      return users;
    },
    [token]
  );

  // const fetchUsers = async (role: string) => {
  //   const users: User[] = [];
  //   try {
  //     const response = await fetchAllUsersByRole(role);

  //     if (response && response.length > 0) {
  //       // Fetch full user details for each reviewer using their auth0_id
  //       const userDetailsPromises = response.map(async (user: any) => {
  //         const userDetails = await fetchAllUsersDetails(token, user.auth0_id);
  //         return {
  //           ...user,
  //           ...userDetails,
  //         };
  //       });

  //       if (userDetailsPromises) {
  //         // Wait for all promises to resolve
  //         const fullUserDetails: User[] = await Promise.all(
  //           userDetailsPromises
  //         );
  //         // Set the state with full user details
  //         // setUsers(fullUserDetails);
  //         users.push(...fullUserDetails);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //     const dummyUsers = [
  //       {
  //         auth0_id: 'google-oauth2|114640128305555424834',
  //         name: 'Steve Nyaga',
  //         email: 'stevenyaga@gmail.com',
  //       },
  //     ];
  //     users.push(...dummyUsers);
  //   }
  //   return users;
  // };

  const redirectOnSuccess = () => {
    router.push({
      pathname: '/uploaded-dataset',
      // query: { id: params.value },
    });
  };

  const handleAction = async (data: FormData) => {
    const comments: any = data.get('comments') || '';
    const assignees: any = data.get('recipients') || [];
    const files: any = data.get('files') || null;
    // @TODO implement redirect on action. See https://medium.com/@ofir3322/redirect-on-action-strategy-using-redux-b5db14269f8c
    if (
      props.action == UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS
    ) {
      await dispatch(
        assignPrimaryReviewers({
          datasetId: dataset.id,
          comments: comments,
          assignees: assignees,
        })
      );
    }
    if (
      props.action == UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS
    ) {
      await dispatch(
        assignTertiaryReviewers({
          datasetId: dataset.id,
          comments: comments,
          assignees: assignees,
        })
      );
    }
    if (props.action == UploadedDatasetActionTypeEnum.APPROVE) {
      const resp = await dispatch(
        approveUploadedDataset({
          datasetId: dataset.id,
          comments: comments,
        })
      );
    }
    if (props.action == UploadedDatasetActionTypeEnum.REJECT) {
      await dispatch(
        rejectUploadedDataset({
          datasetId: dataset.id,
          comments: comments,
        })
      );
    }

    if (props.action == UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW) {
      await dispatch(
        completePrimaryReview({
          datasetId: dataset.id,
          files: files,
          comments: comments,
        })
      );
    }

    if (
      props.action == UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW
    ) {
      await dispatch(
        completeTertiaryReview({
          datasetId: dataset.id,
          files: files,
          comments: comments,
        })
      );
    }

    if (props.action == UploadedDatasetActionTypeEnum.SEND_EMAIL) {
      await dispatch(
        adhocCommunication({
          datasetId: dataset.id,
          message: comments,
          recipients: assignees,
          files: files,
        })
      );
    }

    if (props.action == UploadedDatasetActionTypeEnum.VALIDATE) {
      await dispatch(
        validateDataset({
          datasetId: dataset.id,
        })
      );
    }

    if (props.action == UploadedDatasetActionTypeEnum.ADHOC_VALIDATE) {
      await dispatch(
        adhocValidateDataset({
          files: files,
        })
      );
    }

    if (props.action == UploadedDatasetActionTypeEnum.REQUEST_REUPLOAD) {
      await dispatch(
        requestDatasetReupload({
          datasetId: dataset.id,
          comments,
        })
      );
    }

    // we could be approving and errors were thrown. So do not close but display errors
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    await dispatch(getUploadedDatasets());
    handleOk();
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
      const makeUploaderUser = () => {
        return {
          auth0_id: '',
          name: dataset.uploader_name,
          email: dataset.uploader_email,
        };
      };
      let recipients: User[] = [];
      if (!props.action) {
        setUsers([]);
        return;
      }
      if (
        props.action ==
          UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS ||
        props.action == UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS
      ) {
        recipients = await fetchUsers('reviewer');
      }
      if (props.action == UploadedDatasetActionTypeEnum.APPROVE) {
        recipients = await fetchUsers('reviewer'); //notify all reviewers
        recipients.push(...(await fetchUsers('reviewer_manager'))); //notify all managers
        recipients.push(makeUploaderUser()); //notify the uploader
      }

      if (
        props.action == UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW ||
        props.action == UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW
      ) {
        recipients.push(...(await fetchUsers('reviewer_manager'))); //notify all managers
      }
      if (props.action == UploadedDatasetActionTypeEnum.REJECT) {
        recipients.push(makeUploaderUser()); //notify the uploader
      }
      let unique = recipients.filter(
        (value, index, array) => array.indexOf(value) === index
      );
      setUsers(unique);
      setDefaultRecipients(unique);
      return recipients;
    };
    getDefaultRecipients();
  }, [props.action, dataset, token, fetchUsers]);

  return (
    <Fragment>
      <Dialog
        open={isOpen}
        onClose={handleCancel}
        PaperProps={{
          component: 'form',
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
            if (isValidatingContext) {
              //@TODO revert this
              validateDatasetRef?.current?.validate();
              return;
            }

            if (enforceRecipients() && selectedUsers.length == 0) {
              toast.error('You must specify the recipients');
              return;
            }
            if (enforceUpload() && attachedFiles.length == 0) {
              toast.error('You must attach a file');
              return;
            }
            const formData = new FormData();
            const commentsHtml = await marked(richComments);

            selectedUsers?.map((usr: User | string) => {
              if (typeof usr === 'string') {
                formData.append('recipients', usr as string);
              } else {
                formData.append('recipients', usr?.email);
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
          },
        }}
      >
        <DialogTitle>
          <StatusRenderer status={props.action} statusTitle={props.action} />
        </DialogTitle>
        {isValidatingContext /* || Object.keys(validationErrors).length > 0*/ && (
          <>
            <DialogContent>
              <ValidateDatasetDialog
                datasetId={dataset?.id}
                ref={validateDatasetRef}
                validationType={props.action}
              />
            </DialogContent>
          </>
        )}
        {!isValidatingContext && (
          <DialogContent>
            {enforceRecipients() && (
              <div>
                <FormLabel>
                  {props.action == UploadedDatasetActionTypeEnum.SEND_EMAIL
                    ? 'Recipients'
                    : 'Assignees'}
                </FormLabel>
                {allowExternalEmails && (
                  <>
                    <br />
                    <Typography variant="caption">
                      Press the Enter button to add typed email to list of
                      recipients
                    </Typography>
                    <br />
                  </>
                )}
                <Autocomplete
                  multiple
                  options={users}
                  freeSolo={allowExternalEmails}
                  // value={defaultRecipients}
                  getOptionLabel={(option: string | User) => {
                    if (typeof option === 'string') {
                      return option.toString();
                    } else {
                      return option.name;
                    }
                    // if (allowExternalEmails) {
                    //   return option.toString();
                    // } else {
                    //   return option.name;
                    // }
                  }}
                  onChange={(event, newValue: any) => {
                    if (!allowExternalEmails) {
                      setSelectedUsers(newValue);
                    } else {
                      const usrs: User[] = [];
                      newValue?.map((el: string | User) => {
                        // const exists = usrs.filter(
                        //   (itm) => itm.name === el?.toString()
                        // );
                        // if (exists) {
                        //   return;
                        // }
                        usrs.push({
                          auth0_id: '',
                          name: el?.toString(),
                          email: el?.toString(),
                        });
                      });
                      setSelectedUsers(usrs);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // label="Select Recipients"
                      variant="outlined"
                    />
                  )}
                />
                <br />
              </div>
            )}
            <DialogContentText>
              Please enter comments in the editor below
            </DialogContentText>
            <ReactQuill
              value={richComments}
              onChange={(val) => setRichComments(val)}
              placeholder="Write your comments here..."
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
                  //   style={{ width: '50%', minWidth: '200px', fontSize: 'small' }}
                >
                  <UploadIcon />
                  Attach File
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
            type="submit"
            variant="contained"
            color="primary"
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
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
