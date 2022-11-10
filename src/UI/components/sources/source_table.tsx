import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useAppSelector } from "../../state/hooks";
import DoneIcon from '@mui/icons-material/Done';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { changeSourcePage, changeSourceRowsPerPage } from "../../state/sourceSlice";

const headers = [
  'Author',
  'Title',
  'Journal Title',
  'Year',
  'Published',
  'Vector Data'
]

export default function SourceTable(): JSX.Element {
  const source_list = useAppSelector((state) => state.source.source_info);
  const table_options = useAppSelector((state) => state.source.source_table_options);
  const dispatch = useDispatch<AppDispatch>();

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(changeSourcePage(newPage));
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeSourceRowsPerPage(parseInt(event.target.value, 10)));
  }
  return (
    <>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            {headers.map((header) => (
              <TableCell key={header}>
                <Typography variant='h6'>
                  {header}
                </Typography>
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {source_list.items.map((row) => (
              <TableRow hover key={row.citation}>
                <TableCell>
                  {row.author}
                </TableCell>
                <TableCell>
                  {row.article_title}
                </TableCell>
                <TableCell>
                  {row.journal_title}
                </TableCell>
                <TableCell align='center'>
                  {row.year}
                </TableCell>
                <TableCell align='center'>
                  {row.published ? <DoneIcon color='primary' /> : null}
                </TableCell>
                <TableCell align='center'>
                  {row.v_data ? <DoneIcon color='primary' /> : null}
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
  )
}
