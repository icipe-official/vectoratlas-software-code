import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { getMessages } from '../../../utils/localization';
import { GetServerSidePropsContext } from 'next';

interface RegistryRecord {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  account_status: string;
  notifications_enabled: boolean;
}

const statusColors: Record<
  string,
  'success' | 'warning' | 'default' | 'error'
> = {
  verified: 'success',
  pending_verification: 'warning',
  unsubscribed: 'default',
  deactivated: 'error',
};

const AdminEmailRegistryPage = (): JSX.Element => {
  const t = useTranslations('Admin');
  const [records, setRecords] = useState<RegistryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/vector-api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            adminEmailRegistry(page: 1, limit: 50) {
              data { id email first_name last_name account_status notifications_enabled }
            }
          }
        `,
      }),
    });
    const json = await res.json();
    setRecords(json.data?.adminEmailRegistry?.data || []);
    setLoading(false);
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/vector-api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            adminAddEmailRegistry(input: { email: "${email}", first_name: "${firstName}", last_name: "${lastName}" }) {
              id
            }
          }
        `,
      }),
    });
    setShowModal(false);
    setEmail('');
    setFirstName('');
    setLastName('');
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('title') || 'Email Registry'}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => setShowModal(true)}>
          {t('addUser') || '+ Add User'}
        </Button>
        <Button
          variant="outlined"
          href="/vector-api/api/export"
          component="a"
          target="_blank"
        >
          {t('downloadExcel') || '📥 Download Excel'}
        </Button>
      </Box>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t('addUserTitle') || 'Manually Add Subscriber'}
        </DialogTitle>
        <form onSubmit={addUser}>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>
              {t('cancel') || 'Cancel'}
            </Button>
            <Button type="submit" variant="contained">
              {t('add') || 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notifications</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>
                    {r.first_name} {r.last_name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={r.account_status}
                      color={statusColors[r.account_status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {r.notifications_enabled ? 'On' : 'Off'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default AdminEmailRegistryPage;
