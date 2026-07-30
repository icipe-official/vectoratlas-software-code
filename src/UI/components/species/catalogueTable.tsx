import React, { useState, useEffect } from 'react';
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
  Paper,
  CircularProgress,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import CatalogueFIlter from './speciesFilter';
import { useAppSelector } from '../../state/hooks';
import { RolesEnum } from '../../state/state.types';
import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'react-toastify';
import { useSpeciesDb } from '../shared/useSpeciesDb';

interface SpeciesItem {
  id: string;
  scientificName: string;
  displayName: string;
  category: string;
}

export default function CatalogueTable(): JSX.Element {
  const t = useTranslations('cataloguePage');
  const router = useRouter();
  const { user } = useUser();
  const roles = useAppSelector((state) => state.auth.roles) || [];

  const isEditor =
    (user &&
      (roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.EDITOR))) ;

  const [speciesList, setSpeciesList] = useState<SpeciesItem[]>([]);

  const dbSpeciesData = useSpeciesDb(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting states
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof SpeciesItem>('scientificName');

  useEffect(() => {
    if (dbSpeciesData && dbSpeciesData.length > 0) {
      const cleanedItems = dbSpeciesData.map((sp) => ({
        id: sp.id,
        scientificName: sp.species || '',
        displayName: sp.display_name || '',
        category: sp.category || 'Secondary', // Default to Secondary if undefined
      }));
      setSpeciesList(cleanedItems);
    }
  }, [dbSpeciesData]);

  const filteredItems = speciesList.filter((item) => {
    const matchesSearch =
      item.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scientificName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const headers = React.useMemo(
    () => [
      {
        text: t('grid.scientificName') || 'Scientific Name',
        id: 'scientificName',
      },
      { text: t('grid.displayName') || 'Display Name', id: 'displayName' },
      { text: t('grid.category') || 'Category', id: 'category' },
    ],
    [t]
  );

  const handleSort = (property: keyof SpeciesItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: 600, flexGrow: 1 }}
        >
          {t('title') || 'Species Registry Catalog'}
        </Typography>
      </Box>

      <Paper sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}
        >
          <CatalogueFIlter
            onSearchChange={(query) => setSearchQuery(query)}
            onCategoryChange={(category) => setCategoryFilter(category)}
          />
        </Box>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sortDirection={orderBy === header.id ? order : false}
                    sx={{ backgroundColor: '#ffffff', fontWeight: 'bold' }}
                  >
                    <TableSortLabel
                      active={orderBy === header.id}
                      direction={orderBy === header.id ? order : 'asc'}
                      onClick={() => handleSort(header.id as keyof SpeciesItem)}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {header.text}
                      </Typography>
                      {orderBy === header.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {dbSpeciesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} sx={{ mb: 2 }} />
                    <Typography color="textSecondary" variant="body1">
                      Loading species catalog...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : sortedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary" variant="body1">
                      No records exist in the database matching current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      onClick={() => {
                        if (isEditor) {
                          router.push(`/SpeciesEditPage?id=${row.id}`);
                        }
                      }}
                      style={{ cursor: isEditor ? 'pointer' : 'default' }}
                    >
                      <TableCell
                        style={{ fontStyle: 'italic', fontWeight: 600 }}
                      >
                        {row.scientificName}
                      </TableCell>
                      <TableCell>
                        {row.displayName || (
                          <Typography variant="caption" color="error">
                            Empty (Click to edit)
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        {(() => {
                          const translationKey =
                            row.category.charAt(0).toUpperCase() +
                            row.category.slice(1).toLowerCase();
                          const translatedValue = t(
                            `filters.categories.${translationKey}`
                          );
                          return translatedValue.startsWith('cataloguePage')
                            ? row.category
                            : translatedValue;
                        })()}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
