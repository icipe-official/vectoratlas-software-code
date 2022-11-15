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
import { useAppSelector } from '../../state/hooks';
import DoneIcon from '@mui/icons-material/Done';
import { visuallyHidden } from '@mui/utils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import {
  changeSourcePage,
  changeSourceRowsPerPage,
  getSourceInfo,
  changeSort,
} from '../../state/sourceSlice';

const headers = [
  { text: 'Id', id: 'num_id' },
  { text: 'Author', id: 'author' },
  { text: 'Title', id: 'article_title' },
  { text: 'Journal Title', id: 'journal_title' },
  { text: 'Year', id: 'year' },
  { text: 'Published', id: 'published' },
  { text: 'Vector Data', id: 'v_data' },
];

export default function SourceTable(): JSX.Element {
  const source_list = useAppSelector((state) => state.source.source_info);
  const table_options = useAppSelector(
    (state) => state.source.source_table_options
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(changeSourcePage(newPage));
    dispatch(getSourceInfo());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(changeSourceRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(getSourceInfo());
  };

  const handleSort = (header_id: string) => {
    dispatch(changeSort(header_id));
    dispatch(getSourceInfo());
  }

  return (
    <>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            {headers.map((header) => (
              <TableCell key={header.id} sortDirection={table_options.orderBy === header.id ? table_options.order : false}>
                <TableSortLabel
                  active={table_options.orderBy === header.id}
                  direction={table_options.orderBy === header.id ? table_options.order : 'asc'}
                  onClick={() => handleSort(header.id)}
                >
                  <Typography variant="h6">{header.text}</Typography>
                  {table_options.orderBy === header.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {table_options.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {source_list.items.map((row) => (
              <TableRow
                hover
                key={row.citation}
                data-testid={`row ${row.num_id}`}
              >
                <TableCell>{row.num_id}</TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>{row.article_title}</TableCell>
                <TableCell>{row.journal_title}</TableCell>
                <TableCell align="center">{row.year}</TableCell>
                <TableCell align="center">
                  {row.published ? <DoneIcon color="primary" /> : null}
                </TableCell>
                <TableCell align="center">
                  {row.v_data ? <DoneIcon color="primary" /> : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={source_list.total}
        rowsPerPage={table_options.rowsPerPage}
        page={table_options.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
