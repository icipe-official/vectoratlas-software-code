import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useAppSelector } from "../../state/hooks";
import { Source } from "../../state/sourceSlice";

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
  return (
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
          {source_list.map((row, index) => (
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
              <TableCell>
                {row.year}
              </TableCell>
              <TableCell>
                {row.published}
              </TableCell>
              <TableCell>
                {row.v_data}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}