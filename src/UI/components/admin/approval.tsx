import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  getAllDatasets,
  updateDataset,
} from '../../state/approval/approval.action';
import { deleteDataset } from '../../state/review/actions/deleteDataset';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dataset } from '../../state/state.types';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';
import { useState } from 'react';

const selectDatasetList = (state: any): Dataset[] => state.dataset.datasetList;
const selectLoading = (state: any): boolean => state.dataset.loading;

export default function ApprovalPage() {
  const dispatch = useAppDispatch();
  const datasets = useAppSelector(selectDatasetList);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(getAllDatasets());
  }, [dispatch]);

  const handleApprove = (id: string) => {
    dispatch(updateDataset({ id, input: { status: 'Approved' } })).then(() => {
      dispatch(getAllDatasets()); // Refresh list after update
    });
  };

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteResult(null);
    dispatch(deleteDataset({ datasetId: deleteTarget }))
      .unwrap()
      .then(() => {
        setDeleteResult('Dataset deleted successfully.');
        dispatch(getAllDatasets()); // Refresh list after delete
      })
      .catch((e: any) => {
        setDeleteResult(`Delete failed: ${e?.message || e || 'unknown error'}`);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const pendingDatasets = datasets;

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Pending Dataset Approvals
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingDatasets.length > 0 ? (
                pendingDatasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>{dataset.id}</TableCell>
                    <TableCell>{dataset.status}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApprove(dataset.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            setDeleteTarget(dataset.id);
                            setDeleteResult(null);
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No datasets pending approval.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
      >
        <DialogTitle>Delete dataset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete dataset <strong>{deleteTarget}</strong>? Rows exclusively
            owned by it are removed; shared sites/references/species used by
            other datasets are kept. This cannot be undone.
          </DialogContentText>
          {deleteResult && (
            <Typography
              mt={2}
              color={
                deleteResult.startsWith('Delete failed')
                  ? 'error'
                  : 'success.main'
              }
            >
              {deleteResult}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            {deleteResult ? 'Close' : 'Cancel'}
          </Button>
          {!deleteResult && (
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              startIcon={
                deleting ? <CircularProgress size={16} /> : <DeleteIcon />
              }
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
