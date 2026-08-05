import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { AppDispatch } from '../../state/store';
import {
  changeSourcePage,
  changeSourceRowsPerPage,
  changeSort,
} from '../../state/source/sourceSlice';
import SourceFilters from './source_filters';
import { getSourceInfo } from '../../state/source/actions/getSourceInfo';
import { deleteSource } from '../../state/source/actions/deleteSource';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';

// Renders Markdown (e.g. *italic*, **bold**) inline, without wrapping
// the content in a <p> tag — which would otherwise break table layout.
const InlineMarkdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    components={{
      p: ({ children }) => <>{children}</>,
    }}
  >
    {children}
  </ReactMarkdown>
);

export default function SourceTable(): JSX.Element {
  const t = useTranslations('SourcesPage');
  const router = useRouter();

  const source_list = useAppSelector((state) => state.source.source_info);
  const table_options = useAppSelector(
    (state) => state.source.source_table_options
  );
  // Same roles this page's edit route already requires (see edit_source.tsx:
  // <AuthWrapper role={['uploader', 'editor']}>)
  const canEdit = useAppSelector((state) =>
    ['uploader', 'editor'].some((role) => state.auth.roles.includes(role))
  );

  const dispatch = useDispatch<AppDispatch>();

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const headers = [
    { text: t('grid.author'), id: 'author' },
    { text: t('grid.title'), id: 'article_title' },
    { text: t('grid.journalTitle'), id: 'journal_title' },
    { text: t('grid.year'), id: 'year' },
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(changeSourcePage(newPage));
    dispatch(getSourceInfo());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(changeSourceRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(changeSourcePage(0));
    dispatch(getSourceInfo());
  };

  const handleSort = (header_id: string) => {
    dispatch(changeSort(header_id));
    dispatch(getSourceInfo());
  };

  const handleEditClick = (num_id: number) => {
    router.push(`/edit_source?id=${num_id}`);
  };

  const handleDeleteClick = (num_id: number) => {
    setDeleteTarget(num_id);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget !== null) {
      setIsDeleting(true);
      await dispatch(deleteSource(deleteTarget));
      await dispatch(getSourceInfo());
      setIsDeleting(false);
    }
    setDeleteTarget(null);
  };

  // === Filter logic ===
  const numIdsParam = router.query.num_ids as string | undefined;

  let filteredItems = source_list.items;

  if (numIdsParam) {
    const numIds = numIdsParam
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((n) => !isNaN(n));

    filteredItems = source_list.items.filter((row) =>
      numIds.includes(row.num_id)
    );
  }

  return (
    <>
      <SourceFilters />

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header.id} sx={{ paddingTop: '0' }}>
                  <TableSortLabel
                    data-testid={`sort-${header.id}`}
                    active={table_options.orderBy === header.id}
                    direction={
                      table_options.orderBy === header.id
                        ? table_options.order
                        : 'asc'
                    }
                    onClick={() => handleSort(header.id)}
                  >
                    <Typography variant="h6">{header.text}</Typography>

                    {table_options.orderBy === header.id && (
                      <Box component="span" sx={visuallyHidden}>
                        {table_options.order === 'desc'
                          ? 'sorted descending'
                          : 'sorted ascending'}
                      </Box>
                    )}
                  </TableSortLabel>
                </TableCell>
              ))}
              {canEdit && (
                <TableCell sx={{ paddingTop: '0' }}>
                  <Typography variant="h6">{t('grid.actions')}</Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredItems.map((row) => (
              <TableRow
                hover
                key={row.num_id}
                data-testid={`row-${row.num_id}`}
              >
                {headers.map((header) => {
                  const value = row[header.id as keyof typeof row];
                  return (
                    <TableCell key={header.id}>
                      {typeof value === 'string' ? (
                        <InlineMarkdown>{value}</InlineMarkdown>
                      ) : (
                        value
                      )}
                    </TableCell>
                  );
                })}
                {canEdit && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      data-testid={`edit-${row.num_id}`}
                      onClick={() => handleEditClick(row.num_id)}
                      sx={{ marginRight: 1 }}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      data-testid={`delete-${row.num_id}`}
                      onClick={() => handleDeleteClick(row.num_id)}
                    >
                      {t('delete')}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {numIdsParam && (
        <Box sx={{ padding: 2 }}>
          <Typography variant="body2">
            Showing filtered citations.{' '}
            <a
              href="/sources"
              style={{ textDecoration: 'underline', color: '#1976d2' }}
            >
              See all citations
            </a>
          </Typography>
        </Box>
      )}

      {!numIdsParam && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={source_list.total}
          rowsPerPage={table_options.rowsPerPage}
          page={table_options.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {canEdit && (
        <Dialog
          open={deleteTarget !== null}
          onClose={handleCancelDelete}
          data-testid="delete-confirm-dialog"
        >
          <DialogTitle>{t('deleteConfirm.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('deleteConfirm.message')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} disabled={isDeleting}>
              {t('deleteConfirm.cancel')}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              disabled={isDeleting}
              data-testid="confirm-delete"
            >
              {t('deleteConfirm.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}