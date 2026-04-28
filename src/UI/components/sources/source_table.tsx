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
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
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
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

export default function SourceTable(): JSX.Element {
  const t = useTranslations('SourcesPage');
  const router = useRouter();

  const source_list = useAppSelector((state) => state.source.source_info);
  const table_options = useAppSelector(
    (state) => state.source.source_table_options
  );

  const dispatch = useDispatch<AppDispatch>();

  // ✅ Single source of truth for columns
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
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredItems.map((row) => (
              <TableRow
                hover
                key={row.num_id}
                data-testid={`row-${row.num_id}`}
              >
                {headers.map((header) => (
                  <TableCell key={header.id}>
                    {row[header.id as keyof typeof row]}
                  </TableCell>
                ))}
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
    </>
  );
}
