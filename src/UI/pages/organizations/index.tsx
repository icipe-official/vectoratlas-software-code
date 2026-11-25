// pages/organizations/index.tsx  (list page: localhost:3002/organizations)
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { GetServerSidePropsContext } from 'next';
import AuthWrapper from '../../components/shared/AuthWrapper';
import { RolesEnum } from '../../state/state.types';
import { getMessages } from '../../utils/localization';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import {
  Organization,
  deleteOrganization,
  listOrganizations,
} from '../../api/organizationService';
import { useAuthToken } from '../../hooks/useAuthToken';
import LogoThumb from '../../components/organization/LogoThumb';
import { getOrganizationLogoUrl } from '../../api/organizationApi';
import Toast, {
  ToastState,
  closedToast,
} from '../../components/organization/Toast';
import { brand } from '../../components/organization/organizationUi';

function OrganizationsContent() {
  const t = useTranslations('OrganizationPage');
  const router = useRouter();
  const token = useAuthToken();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<Organization | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState>(closedToast);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setOrganizations(await listOrganizations(token));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : t('loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // The Add page sends people back here with ?created=<name>.
  useEffect(() => {
    if (!router.isReady) return;
    const created = router.query.created;
    if (typeof created === 'string' && created) {
      setToast({
        open: true,
        severity: 'success',
        message: t('created', { name: created }),
      });
      router.replace('/organizations', undefined, { shallow: true });
    }
  }, [router.isReady, router.query.created]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return organizations;
    return organizations.filter(
      (o) =>
        o.name.toLowerCase().includes(term) ||
        o.website.toLowerCase().includes(term)
    );
  }, [organizations, search]);

  // The API blocks deletion while datasets with occurrence records are linked to the
  // organization. If that happens, its message is shown in the error toast.
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteOrganization(toDelete.id, token);
      setOrganizations((prev) => prev.filter((o) => o.id !== toDelete.id));
      setToast({
        open: true,
        severity: 'success',
        message: t('deleted', { name: toDelete.name }),
      });
    } catch (e) {
      setToast({
        open: true,
        severity: 'error',
        message: e instanceof Error ? e.message : t('deleteFailed'),
      });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: brand.green, fontWeight: 600 }}
          >
            {t('title')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          onClick={() => router.push('/add_organization')}
          sx={{
            textTransform: 'none',
            bgcolor: brand.green,
            '&:hover': { bgcolor: brand.greenDark },
            px: 2.5,
          }}
        >
          {t('add')}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${brand.border}`,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${brand.border}` }}>
          <TextField
            size="small"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 340 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: brand.muted }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress sx={{ color: brand.green }} />
          </Box>
        ) : loadError ? (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={load}>
                  {t('tryAgain')}
                </Button>
              }
            >
              {loadError}
            </Alert>
          </Box>
        ) : visible.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: brand.text }}>
              {organizations.length === 0 ? t('empty') : t('noMatch')}
            </Typography>
            <Typography variant="body2" sx={{ color: brand.muted, mt: 0.5 }}>
              {organizations.length === 0 ? t('emptyHelp') : t('noMatchHelp')}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: brand.surface }}>
                  <TableCell sx={{ fontWeight: 600, width: 140 }}>
                    {t('logo')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t('organization')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    {t('actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((org) => (
                  <TableRow key={org.id} hover>
                    <TableCell>
                      <LogoThumb
                        src={getOrganizationLogoUrl(org.logoUrl) ?? null}
                        name={org.name}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: brand.text }}>
                        {org.name}
                      </Typography>
                      {org.website && (
                        <MuiLink
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          variant="body2"
                          sx={{ color: brand.muted }}
                        >
                          {org.website.replace(/^https?:\/\//, '')}
                        </MuiLink>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() =>
                            router.push({
                              pathname: '/edit_organization',
                              query: { id: org.id },
                            })
                          }
                          sx={{
                            textTransform: 'none',
                            borderColor: brand.green,
                            color: brand.green,
                          }}
                        >
                          {t('editAction')}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => setToDelete(org)}
                          sx={{
                            textTransform: 'none',
                            borderColor: brand.danger,
                            color: brand.danger,
                          }}
                        >
                          {t('delete')}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={Boolean(toDelete)}
        onClose={() => !deleting && setToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {t('deleteTitle', { name: toDelete?.name ?? '' })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t('deleteMessage')}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setToDelete(null)}
            disabled={deleting}
            sx={{ textTransform: 'none', color: brand.muted }}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleting}
            variant="contained"
            disableElevation
            sx={{
              textTransform: 'none',
              bgcolor: brand.danger,
              '&:hover': { bgcolor: '#a31f40' },
            }}
          >
            {deleting ? t('deleting') : t('deleteOrganization')}
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        toast={toast}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </Container>
  );
}

export default function OrganizationsPage() {
  return (
    <AuthWrapper role={RolesEnum.ADMIN}>
      <OrganizationsContent />
    </AuthWrapper>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
