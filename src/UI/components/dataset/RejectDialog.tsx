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
import { rejectRawDataset, rejectReviewedDatasets } from '../../api/api';

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  datasetId: string | null;
  rejectType: string;
}

const RejectDialog: React.FC<RejectDialogProps> = ({ open, onClose, datasetId, rejectType }) => {
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleReject = async () => {
    setLoading(true);

    try {
      if (datasetId) {
        let result;
        if(rejectType === "beforeApproval") {
          result = await rejectRawDataset(datasetId, comment);
        }else if(rejectType === "afterApproval") {
          result = await rejectReviewedDatasets(datasetId, comment);
        }

        if (result && result === true) {
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
      onClose();
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
