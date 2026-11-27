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
  useMediaQuery,
  useTheme,
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
import { InlineMarkdown } from './sourceText';
import SourceCards from './SourceCards';

// Minimum widths keep short columns readable when titles are long
const MIN_WIDTH: Record<string, number> = {
  author: 120,
  year: 70,
};

// Shared header text style, so sort labels and plain headers line up
const headerTextSx = { lineHeight: 1.2, display: 'block' };

export default function SourceTable(): JSX.Element {
  const t = useTranslations('SourcesPage');
  const router = useRouter();
  const theme = useTheme();

  // Below md (900px) show cards instead of the table
  const isCompact = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  });

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

  // Fall back to an empty list until the first fetch completes
  let filteredItems = source_list.items ?? [];

  if (numIdsParam) {
    const numIds = numIdsParam
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((n) => !isNaN(n));

    filteredItems = filteredItems.filter((row) => numIds.includes(row.num_id));
  }

  return (
    <>
      <SourceFilters />

      {isCompact ? (
        <SourceCards
          items={filteredItems}
          canEdit={canEdit}
          orderBy={table_options.orderBy}
          order={table_options.order}
          onSort={handleSort}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      ) : (
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table
            stickyHeader
            sx={{
              width: '100%',
              // Body cells may break long words; the header rule below stops that for headings
              '& .MuiTableCell-root': {
                verticalAlign: 'top',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                hyphens: 'auto',
              },
              // Headers sit on a shared bottom line, wrap only at spaces,
              // and never split mid-word
              '& .MuiTableCell-head': {
                verticalAlign: 'bottom',
                overflowWrap: 'normal',
                wordBreak: 'normal',
                hyphens: 'manual',
                whiteSpace: 'normal',
              },
              // Year values never split (e.g. "201 / 2")
              '& .year-cell': {
                whiteSpace: 'nowrap',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              },
            }}
          >
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{ minWidth: MIN_WIDTH[header.id] }}
                  >
                    <TableSortLabel
                      data-testid={`sort-${header.id}`}
                      active={table_options.orderBy === header.id}
                      direction={
                        table_options.orderBy === header.id
                          ? table_options.order
                          : 'asc'
                      }
                      onClick={() => handleSort(header.id)}
                      sx={{ lineHeight: 1.2 }}
                    >
                      <Typography variant="h6" sx={headerTextSx}>
                        {header.text}
                      </Typography>

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
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="h6" sx={headerTextSx}>
                      {t('grid.actions')}
                    </Typography>
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
                      <TableCell
                        key={header.id}
                        className={
                          header.id === 'year' ? 'year-cell' : undefined
                        }
                        sx={{ minWidth: MIN_WIDTH[header.id] }}
                      >
                        {typeof value === 'string' ? (
                          <InlineMarkdown>{value}</InlineMarkdown>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                  {canEdit && (
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          data-testid={`edit-${row.num_id}`}
                          onClick={() => handleEditClick(row.num_id)}
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
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
          sx={{
            // Keep select, range text and arrows on a single line
            '.MuiTablePagination-toolbar': {
              flexWrap: 'nowrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              paddingLeft: { xs: 0, sm: 2 },
              paddingRight: { xs: 0, sm: 2 },
              minHeight: { xs: 48, sm: 52 },
            },
            // Hide the label and spacer on phones to save width
            '.MuiTablePagination-selectLabel': {
              display: { xs: 'none', sm: 'block' },
            },
            '.MuiTablePagination-spacer': {
              display: { xs: 'none', sm: 'block' },
            },
            // Tighter default margins around the rows-per-page select
            '.MuiTablePagination-input': {
              marginLeft: { xs: 0, sm: '8px' },
              marginRight: { xs: '8px', sm: '32px' },
            },
            '.MuiTablePagination-displayedRows': {
              margin: 0,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              whiteSpace: 'nowrap',
            },
            // Default 20px gap before the arrows is too much on phones
            '.MuiTablePagination-actions': {
              marginLeft: { xs: '4px', sm: '20px' },
              flexShrink: 0,
              whiteSpace: 'nowrap',
            },
            '.MuiTablePagination-actions .MuiIconButton-root': {
              padding: { xs: '4px', sm: '8px' },
            },
          }}
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
