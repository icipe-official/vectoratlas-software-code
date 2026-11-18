import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Organization,
  OrganizationFormValues,
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization,
} from '../../api/organizationApi';

interface Props {
  getToken: () => Promise<string | undefined>;
}

const emptyForm: OrganizationFormValues = {
  name: '',
  website: '',
  logo: '',
  acknowledgement: '',
  terms_and_conditions: '',
};

type SearchField = 'name' | 'website' | 'acknowledgement';

export default function OrganizationManager({ getToken }: Props) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchField, setSearchField] = useState<SearchField>('name');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OrganizationFormValues>(emptyForm);
  const [toDelete, setToDelete] = useState<Organization | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setOrgs(await fetchOrganizations(await getToken()));
    } catch (e) {
      setError((e as Error).message);
    }
  }, [getToken]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      orgs.filter((o) =>
        (o[searchField] ?? '').toLowerCase().includes(search.toLowerCase())
      ),
    [orgs, search, searchField]
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (o: Organization) => {
    setEditingId(o.id);
    setForm({
      name: o.name,
      website: o.website ?? '',
      logo: o.logo ?? '',
      acknowledgement: o.acknowledgement ?? '',
      terms_and_conditions: o.terms_and_conditions ?? '',
    });
    setDialogOpen(true);
  };

  const save = async () => {
    try {
      setError(null);
      const token = await getToken();
      if (editingId) {
        await updateOrganization(token, editingId, form);
      } else {
        await createOrganization(token, form);
      }
      setDialogOpen(false);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setError(null);
      await deleteOrganization(await getToken(), toDelete.id);
      setToDelete(null);
      await load();
    } catch (e) {
      // surfaces the backend's "has linked datasets" refusal
      setError((e as Error).message);
      setToDelete(null);
    }
  };

  const setField =
    (k: keyof OrganizationFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.target.value });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" color="primary">
          Organization List
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          Add organization
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'flex-end' }}>
        <Select
          size="small"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as SearchField)}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="website">Website</MenuItem>
          <MenuItem value="acknowledgement">Acknowledgement</MenuItem>
        </Select>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Logo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Website</TableCell>
            <TableCell>Acknowledgement</TableCell>
            <TableCell>Terms and conditions</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((o) => (
            <TableRow key={o.id}>
              <TableCell>
                <Avatar variant="square" src={o.logo ?? undefined} alt={o.name}>
                  {o.name[0]}
                </Avatar>
              </TableCell>
              <TableCell>{o.name}</TableCell>
              <TableCell>{o.website}</TableCell>
              <TableCell>{o.acknowledgement}</TableCell>
              <TableCell>{o.terms_and_conditions}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => openEdit(o)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setToDelete(o)}
                  >
                    Delete
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No organizations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create / edit dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? 'Edit organization' : 'Add organization'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          <TextField
            label="Name"
            required
            value={form.name}
            onChange={setField('name')}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Website"
            value={form.website ?? ''}
            onChange={setField('website')}
          />
          <TextField
            label="Logo URL"
            value={form.logo ?? ''}
            onChange={setField('logo')}
          />
          {form.logo && (
            <Avatar
              variant="square"
              src={form.logo}
              sx={{ width: 64, height: 64 }}
            />
          )}
          <TextField
            label="Acknowledgement"
            multiline
            minRows={2}
            value={form.acknowledgement ?? ''}
            onChange={setField('acknowledgement')}
          />
          <TextField
            label="Terms and conditions"
            multiline
            minRows={2}
            value={form.terms_and_conditions ?? ''}
            onChange={setField('terms_and_conditions')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!form.name.trim()}
            onClick={save}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete organization</DialogTitle>
        <DialogContent>
          Delete <b>{toDelete?.name}</b>? This is blocked if datasets are linked
          to it.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
