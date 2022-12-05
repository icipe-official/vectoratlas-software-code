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
import Link from 'next/link';
import { useAppSelector } from '../../state/hooks';
import { visuallyHidden } from '@mui/utils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import {
  changeSpeciesPage,
  changeSpeciesRowsPerPage,
  changeSort,
} from '../../state/speciesInformation/speciesInformationSlice';
import { getAllSpecies } from '../../state/speciesInformation/actions/upsertSpeciesInfo.action';
import SpeciesFilters from './speciesFilters';

const headers = [
  { text: 'id', id: 'id' },
  { text: 'Species', id: 'name' },
  { text: 'Description', id: 'shortDescription' },
  { text: 'Image', id: 'speciesImage' },
];

export default function SourceTable(): JSX.Element {
  const speciesList = useAppSelector((state) => state.speciesInfo.speciesList);
  const table_options = useAppSelector(
    (state) => state.speciesInfo.speciesListOptions
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(changeSpeciesPage(newPage));
    dispatch(getAllSpecies());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(changeSpeciesRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(changeSpeciesPage(0));
    dispatch(getAllSpecies());
  };

  const handleSort = (header_id: string) => {
    dispatch(changeSort(header_id));
    dispatch(getAllSpecies());
  };

  console.log(useAppSelector((state) => state.speciesInfo.speciesList));
  return (
    <>
      <SpeciesFilters />
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            {headers.map((header) => (
              <TableCell sx={{ paddingTop: '0' }} key={header.id}>
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
                  {table_options.orderBy === header.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {table_options.order === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {speciesList.items.map((row) => (
              <Link
                href={{
                  pathname: '/individualSpecies',
                  query: {
                    id: row.id,
                  },
                }}
                key={row.species}
              >
                <TableRow hover data-testid={`row ${row.id}`}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.shortDescription}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        height: 100,
                      }}
                      component="img"
                      alt="Mosquito Species #1"
                      src="/species/mosquito_PNG18159.png"
                    />
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={speciesList.total}
        rowsPerPage={table_options.rowsPerPage}
        page={table_options.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
