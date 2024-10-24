import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  IconButton,
  TextField,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { StatusRenderer } from './StatusRenderer';
import { StatusEnum } from '../../state/state.types';
import { fetchAllUsersByRole, fetchAllUsersDetails } from '../../api/api';
import { useAppSelector } from '../../state/hooks';
import { AppState } from '../../state/store';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface User {
  auth0_id: string;
  name: string;
  email: string;
}

interface IApproveRejectDialogProps {
  isOpen: boolean;
  onOk: (vals: object) => void;
  onCancel: () => void;
  title: string;
  isApprove: boolean;
}

export const ApproveRejectDialog = (props: IApproveRejectDialogProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [users, setUsers] = useState<User[]>([]);
  const token = useAppSelector((state: AppState) => state.auth.token);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [richComments, setRichComments] = useState('');

  const handleCancel = () => {
    props.onCancel();
    hideDialog();
  };

  const hideDialog = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await fetchAllUsersByRole('reviewer');

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
            setUsers(fullUserDetails);
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
        ];
        setUsers(dummyUsers);
      }
    };

    fetchReviewers();
  }, [token]);

  return (
    <Fragment>
      <Dialog
        open={isOpen}
        onClose={handleCancel}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            debugger;
            const formJson = Object.fromEntries((formData as any).entries());
            formJson['recipients'] = selectedUsers?.map((usr) => usr.email);
            formJson['comments'] = richComments; //formJson.comments;
            props.onOk(formJson);
            hideDialog();
          },
        }}
      >
        <DialogTitle>
          <StatusRenderer
            status={props.isApprove ? StatusEnum.APPROVED : StatusEnum.REJECTED}
            title={props.title}
          />
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              setSelectedUsers(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Recipients"
                variant="outlined"
              />
            )}
          />
          <br />
          <DialogContentText>
            Please enter comments in the editor below
          </DialogContentText>
          {/* <TextField
            autoFocus
            required
            multiline
            rows={3}
            margin="dense"
            id="name"
            name="comments"
            label="Comments"
            type="text"
            fullWidth
            variant="standard"
          /> */}
          <ReactQuill
            value={richComments}
            onChange={(val) => setRichComments(val)}
            placeholder="Write your comments here..."
            style={{ minHeight: '300px' }}
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
        </DialogContent>

        <DialogActions>
          <Button startIcon={<CancelIcon />} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" startIcon={<SaveIcon />}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
