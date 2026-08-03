import React, { useState, useEffect, useMemo } from 'react';
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
  TextField,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../state/hooks';
import { RolesEnum } from '../../state/state.types';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useCountryDb } from '../shared/useCountryDb';

interface CountryItem {
  id: string;
  name: string;
  alternativeNames: string;
}

export default function CountryTable(): JSX.Element {
  const t = useTranslations('countryTable');
  const router = useRouter();
  const { user } = useUser();


  const roles = useAppSelector((state) => state.auth.roles) || [];
  const isEditor = Boolean(
    (user &&
      (roles.includes(RolesEnum.ADMIN) || roles.includes(RolesEnum.EDITOR))) 

  );

  const token = useAppSelector((state) => state.auth.token);
  const records = useCountryDb(true, token as string | null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof CountryItem>('name');
  const [loading, setLoading] = useState(true);

  // 1. Clean data formatting inside useMemo to avoid unnecessary re-mapping
  const countryList = useMemo(() => {
    if (!records || records.length === 0) return [];
    return records.map((c: any) => ({
      id: c.id,
      name: c.name || '',
      alternativeNames: Array.isArray(c.alternative_names)
        ? c.alternative_names.join(', ')
        : c.alternative_names || 'None',
    }));
  }, [records]);

  useEffect(() => {
    if (records.length > 0) setLoading(false);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [records]);

  const processedItems = useMemo(() => {
    return countryList
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.alternativeNames
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [countryList, searchQuery, order, orderBy]);

  const headers = useMemo(
    () => [
      {
        text: t('grid.name') || 'Country Name',
        id: 'name' as keyof CountryItem,
      },
      {
        text: t('grid.alternativeNames') || 'Alternative Names',
        id: 'alternativeNames' as keyof CountryItem,
      },
    ],
    [t]
  );

  const handleSort = (property: keyof CountryItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: 600, flexGrow: 1 }}
        >
          {t('title') || 'Country Registry Catalog'}
        </Typography>
      </Box>

      <Paper sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        {/* Search Toolbar */}
        <Box
          sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder={
              t('filters.searchPlaceholder') || 'Search countries...'
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0); // Reset page on search
            }}
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
                      onClick={() => handleSort(header.id)}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      {t('tableStates.loading')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : processedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      {t('tableStates.empty')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                processedItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      onClick={() =>
                        isEditor && router.push(`/CountryEditPage?id=${row.id}`)
                      }
                      style={{ cursor: isEditor ? 'pointer' : 'default' }}
                    >
                      <TableCell style={{ fontWeight: 600 }}>
                        {row.name}
                      </TableCell>
                      <TableCell>{row.alternativeNames}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={processedItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
}
