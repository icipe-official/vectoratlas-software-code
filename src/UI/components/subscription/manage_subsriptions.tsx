import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '../../state/hooks';
import { apiUrl, AccountStatus } from '../../api/api';
import DateRenderer from '../shared/dateRenderer';
import { exportSubscriber } from '../../api/api';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';
import { string } from 'yup';

interface Subscriber {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_status: AccountStatus;
  notifications_enabled: boolean;
  verification_token: string;
  token_expires_at: Date;
  unsubscription_token: string;
}

export const SubscriptionList = () => {
  const t = useTranslations('AdminPage');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const token = useAppSelector((state) => state.auth.token);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      await exportSubscriber(token.toString());
    } catch (error) {
      console.error('Failed to export subscribers', error);
      alert('Failed to Download excel file. Please try again');
    } finally {
      setExporting(false);
    }
  };

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSub, setNewSub] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [modalError, setModalError] = useState('');

  const fetchSubscribers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${apiUrl}subscribers`, config);
      const data = response.data?.data || response.data || [];
      setSubscribers(data);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [token]);

  const handleUnsubscribe = async (subscriberRow: Subscriber) => {
    if (
      !window.confirm(
        `Are you sure you want to unsubscribe ${subscriberRow.email}?`
      )
    ) {
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: subscriberRow.id,
          token: subscriberRow.unsubscription_token,
        },
      };

      await axios.delete(`${apiUrl}unsubscribe`, config);
      fetchSubscribers();
    } catch (error) {
      console.error('Failed to unsubscribe user:', error);
      alert('Failed to process unsubscription.');
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSub.email.trim()) {
      setModalError('Email is required');
      return;
    }

    setSubmitting(true);
    setModalError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${apiUrl}manual-add`, newSub, config);

      // Reset and close
      setNewSub({ first_name: '', last_name: '', email: '' });
      setOpenModal(false);
      fetchSubscribers(); // Refresh the grid
    } catch (error: any) {
      setModalError(
        error.response?.data?.message || 'Failed to add subscriber'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params: any) =>
        `${params.row.first_name || ''} ${params.row.last_name || ''}`.trim() ||
        'N/A',
    },
    { field: 'email', headerName: 'Email Address', width: 250 },
    {
      field: 'account_status',
      headerName: 'Status',
      width: 180,
      renderCell: (params: GridRenderCellParams) => {
        let color: 'default' | 'success' | 'error' | 'warning' = 'default';
        const status = params.value;

        if (status === AccountStatus.VERIFIED) color = 'success';
        else if (status === AccountStatus.UNSUBSCRIBED) color = 'error';
        else if (status === AccountStatus.PENDING_VERIFICATION)
          color = 'warning';
        else if (status === AccountStatus.DEACTIVATED) color = 'default';

        return (
          <Chip
            label={status.replace('_', ' ').toUpperCase()}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'notifications_enabled',
      headerName: 'Notifications',
      width: 150,
      type: 'boolean',
    },
    {
      field: 'token_expires_at',
      headerName: 'Token Expiry',
      type: 'dateTime',
      width: 180,
      valueGetter: (params: any) =>
        params.row.token_expires_at
          ? new Date(params.row.token_expires_at)
          : null,
      renderCell: ({ row }: { row: any }) =>
        row.token_expires_at ? (
          <DateRenderer value={row.token_expires_at} />
        ) : (
          <span>-</span>
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const isUnsubscribed =
          params.row.account_status === AccountStatus.UNSUBSCRIBED;
        return (
          <IconButton
            color="error"
            size="small"
            disabled={isUnsubscribed}
            onClick={() => handleUnsubscribe(params.row as Subscriber)}
            title={isUnsubscribed ? 'Already unsubscribed' : 'Unsubscribe user'}
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5" color="primary">
          Subscriber List
        </Typography>
        <Button
          variant="outlined"
          onClick={handleExport}
          disabled={exporting}
          sx={{ mr: 2 }}
        >
          {exporting ? 'Exporting...' : 'Export to Excel'}
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Add Subscriber
        </Button>
      </Box>

      <DataGrid
        rows={subscribers}
        columns={columns}
        loading={loading}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
      />

      {/* Manual Add Dialog */}
      <Dialog
        open={openModal}
        onClose={() => !submitting && setOpenModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add New Subscriber</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            value={newSub.first_name}
            onChange={(e) =>
              setNewSub({ ...newSub, first_name: e.target.value })
            }
            disabled={submitting}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={newSub.last_name}
            onChange={(e) =>
              setNewSub({ ...newSub, last_name: e.target.value })
            }
            disabled={submitting}
          />
          <TextField
            margin="dense"
            label="Email Address *"
            type="email"
            fullWidth
            required
            value={newSub.email}
            onChange={(e) => setNewSub({ ...newSub, email: e.target.value })}
            disabled={submitting}
            error={!!modalError}
            helperText={modalError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSubscriber}
            variant="contained"
            disabled={submitting || !newSub.email.trim()}
          >
            {submitting ? <CircularProgress size={24} /> : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
