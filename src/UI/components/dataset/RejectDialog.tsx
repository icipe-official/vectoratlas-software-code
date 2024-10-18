import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import Swal from 'sweetalert2';
import { rejectRawDataset } from '../../api/api';

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  datasetId: string | null;
}

const RejectDialog: React.FC<RejectDialogProps> = ({ open, onClose, datasetId }) => {
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleReject = async () => {
    setLoading(true);

    try {
      if(datasetId != null) {
        const result = await rejectRawDataset(datasetId, comment);
        if (result === "Success") {
          setComment("");
          Swal.fire({
            title: 'Success!',
            text: 'Dataset rejected successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to reject dataset.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    } catch (error) {
      console.error('Error rejecting dataset:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while rejecting the dataset.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
      onClose(); // Close the dialog after submission
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Reject Dataset</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please provide a comment explaining why this dataset is being rejected.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="comment"
          label="Comment"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleReject} color="secondary" disabled={loading}>
          {loading ? 'Rejecting...' : 'Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectDialog;
