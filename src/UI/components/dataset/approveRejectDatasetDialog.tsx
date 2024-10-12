import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface IApproveRejectDialogProps {
  isOpen: boolean;
  onOk: (vals: object) => void;
  onCancel: () => void;
  title: string;
}

export const ApproveRejectDatasetDialog = (
  props: IApproveRejectDialogProps
) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  
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
            const formJson = Object.fromEntries((formData as any).entries());
            const comment = formJson.comment;
            console.log('Approve/Reject comment:', comment);
            props.onOk(formJson);
            hideDialog();
          },
        }}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter any comment in the field below
          </DialogContentText>
          <TextField
            autoFocus
            required
            multiline
            rows={3}
            margin="dense"
            id="name"
            name="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="standard"
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
