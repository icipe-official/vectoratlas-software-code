import { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from '../../state/hooks';
import { getAllDatasets,updateDataset } from '../../state/approval/approval.action';
import { Dataset } from '../../state/state.types';

import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';

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
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingDatasets.length > 0 ? (
                pendingDatasets.map(dataset => (
                  <TableRow key={dataset.id}>
                    <TableCell>{dataset.id}</TableCell>
                    <TableCell>{dataset.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(dataset.id)}
                      >
                        Approve
                      </Button>
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
    </Box>
  );
}
