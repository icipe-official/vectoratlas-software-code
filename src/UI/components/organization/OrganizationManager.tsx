import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  uploadOrganizationLogo,
  getOrganizationLogoUrl,
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

const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function OrganizationManager({ getToken }: Props) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OrganizationFormValues>(emptyForm);
  const [toDelete, setToDelete] = useState<Organization | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!logoFile) return;

    const previewUrl = URL.createObjectURL(logoFile);
    setLogoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [logoFile]);

  const filtered = useMemo(
    () =>
      orgs.filter((o) => o.name.toLowerCase().includes(search.toLowerCase())),
    [orgs, search]
  );

  const resetLogoSelection = () => {
    setLogoFile(null);
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    resetLogoSelection();
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
    setLogoFile(null);
    setLogoPreview(getOrganizationLogoUrl(o.logo) ?? '');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    resetLogoSelection();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setError('Please select a JPEG, PNG or WebP image.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setError('The logo must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }

    setError(null);
    setLogoFile(file);
  };

  const save = async () => {
    if (!form.name.trim()) return;

    try {
      setSaving(true);
      setError(null);

      const token = await getToken();
      let logoUrl = form.logo ?? '';

      if (logoFile) {
        logoUrl = await uploadOrganizationLogo(token, logoFile);
      }

      const input: OrganizationFormValues = {
        ...form,
        name: form.name.trim(),
        logo: logoUrl,
      };

      if (editingId) {
        await updateOrganization(token, editingId, input);
      } else {
        await createOrganization(token, input);
      }

      setDialogOpen(false);
      resetLogoSelection();
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
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
      setError((e as Error).message);
      setToDelete(null);
    }
  };

  const setField =
    (k: keyof OrganizationFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((previous) => ({ ...previous, [k]: e.target.value }));

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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((o) => (
            <TableRow key={o.id}>
              <TableCell>
                <Avatar variant="square" src={getOrganizationLogoUrl(o.logo)} alt={o.name}>
                  {o.name[0]}
                </Avatar>
              </TableCell>
              <TableCell>{o.name}</TableCell>
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
              <TableCell colSpan={3} align="center">
                No organizations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2">Organization logo</Typography>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleLogoChange}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
              >
                Choose image
              </Button>

              <Typography variant="body2" color="text.secondary">
                JPEG, PNG or WebP. Maximum 2 MB.
              </Typography>
            </Box>

            {logoPreview && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  variant="square"
                  src={logoPreview}
                  alt="Organization logo preview"
                  sx={{ width: 80, height: 80 }}
                />
                <Button
                  size="small"
                  color="error"
                  disabled={saving}
                  onClick={() => {
                    resetLogoSelection();
                    setForm((previous) => ({ ...previous, logo: '' }));
                  }}
                >
                  Remove logo
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!form.name.trim() || saving}
            onClick={save}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

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
