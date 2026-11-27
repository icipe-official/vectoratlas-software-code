import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Stack,
  TablePagination,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridCallbackDetails,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  ApproveRejectDialog,
  ActionAssignees,
} from '../shared/approveRejectDialog';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  approveDoiById,
  rejectDoiById,
} from '../../state/doi/actions/doi.actions';
import { getAllDois } from '../../state/doi/actions/doi.actions';
import { StatusRenderer } from '../shared/statusRenderer';
import { StatusEnum } from '../../state/state.types';
import DateRenderer from '../shared/dateRenderer';
import { useTranslations } from 'next-intl';

interface IDoiRequest {
  id: string;
  creation: Date;
  creator_name: string;
  creator_email: string;
  title: string;
  approval_status: string;
}

const APPROVE: string = 'Approve';
const REJECT: string = 'Reject';

// Same page size as the desktop grid footer, so both layouts match
const PAGE_SIZE = 10;

// Phone action buttons: share the card width equally, no wrapping
const mobileButtonSx = {
  flex: 1,
  minWidth: 0,
  px: 1,
  whiteSpace: 'nowrap',
};

function FilterToolbar() {
  return (
    <div>
      <GridToolbarFilterButton />
    </div>
  );
}

// One labelled value inside a card
const CardField = ({
  label,
  children,
  fullWidth = false,
}: {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) => (
  <Box sx={{ minWidth: 0, gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Box sx={{ wordBreak: 'break-word' }}>{children}</Box>
  </Box>
);

export const DoiList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedDoi, setSelectedDoi] = useState('');
  const [page, setPage] = useState(0);
  const doiList = useAppSelector((state) => state.doi.dois);
  const loading = useAppSelector((state) => state.doi.loading);
  const t = useTranslations('DoiListPage');

  // Phone-width check (matches MUI's sm breakpoint)
  const isMobile = useMediaQuery('(max-width:599.95px)');

  // Card-view paging
  const allRows: any[] = doiList || [];
  const pageCount = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));
  const pagedRows = allRows.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  // Go back to page 1 when the list changes (e.g. after a filter or reload)
  useEffect(() => {
    setPage(0);
  }, [doiList]);

  // If approving or rejecting empties the last page, step back one page
  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(Math.max(0, pageCount - 1));
    }
  }, [page, pageCount]);

  const getActionButtons = (params: any) => {
    let actions = [
      <GridActionsCellItem
        key={1}
        icon={<VisibilityIcon />}
        label={t('actions.title')}
        onClick={() => {
          router.push({
            pathname: '/doi/details',
            query: { id: params.id },
          });
        }}
      />,
    ];
    if (params.row.approval_status == StatusEnum.PENDING) {
      actions = actions.concat([
        <GridActionsCellItem
          key={2}
          icon={<CheckCircleIcon />}
          label={t('actions.approve')}
          showInMenu
          onClick={() => {
            setActionType(APPROVE);
            setSelectedDoi(params.id);
            setActionDialogOpen(true);
          }}
        />,
        <GridActionsCellItem
          key={3}
          icon={<CancelIcon />}
          label={t('actions.reject')}
          showInMenu
          onClick={() => {
            setActionType(REJECT);
            setSelectedDoi(params.row.id);
            setActionDialogOpen(true);
          }}
        />,
      ]);
    } else {
      actions = actions.concat([
        <GridActionsCellItem
          key={2}
          icon={<CheckCircleIcon />}
          style={{ display: 'block', visibility: 'hidden' }}
          label=""
          // showInMenu
          onClick={() => {}}
        />,
      ]);
    }
    return actions;
  };

  // Card-view actions: open the approve/reject dialog for one DOI
  const openDecision = (id: string, type: string) => {
    setSelectedDoi(id);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const columns = [
    {
      field: 'title',
      headerName: t('grid.title'),
      width: 250,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <div>{params.value}</div>
      ),
      valueGetter: (params: any) => {
        return <Link href={`/doi/${params.row.id}`}>{params.row.title}</Link>;
      },
    },
    {
      field: 'source_type',
      headerName: t('grid.source'),
      width: 120,
      editable: false,
    },
    {
      field: 'approval_status',
      headerName: t('grid.status'),
      type: 'string',
      width: 120,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <StatusRenderer status={params.value} statusTitle={params.value} />
      ),
    },
    {
      field: 'doi_link',
      headerName: t('grid.doiLink'),
      width: 250,
      editable: false,
    },
    {
      field: 'creation',
      headerName: t('grid.createdOn'),
      type: 'dateTime',
      width: 170,
      valueGetter: (params: any) => new Date(params.row.creation),
      renderCell: ({ row }: { row: any }) => (
        <DateRenderer value={row.creation} />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params: any) => getActionButtons(params),
    },
  ];

  const loadDOIs = useCallback(async () => {
    await dispatch(getAllDois());
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      await loadDOIs();
    };
    loadData();
  }, [loadDOIs]);

  const handleAction = async (formValues: ActionAssignees) => {
    if (!selectedDoi) {
      return;
    }
    const comments = formValues?.comments || '';
    if (actionType == APPROVE) {
      const res = await dispatch(
        approveDoiById({ id: selectedDoi, comments: comments })
      );
      if (res) {
        await loadDOIs();
      }
    }
    if (actionType == REJECT) {
      const res = await dispatch(
        rejectDoiById({ id: selectedDoi, comments: comments })
      );
      if (res) {
        await loadDOIs();
      }
    }
  };

  return (
    <>
      <div>
        <main>
          <div>
            <Typography variant="h5">{t('title')}</Typography>

            {isMobile ? (
              // PHONE: one card per DOI, 10 per page, with pagination below
              <>
                <Stack spacing={1} sx={{ mt: 2, minWidth: 0 }}>
                  {pagedRows.map((row: any) => {
                    const isPending = row.approval_status == StatusEnum.PENDING;
                    return (
                      <Card
                        key={row.id}
                        variant="outlined"
                        sx={{ width: '100%', minWidth: 0 }}
                      >
                        <CardContent
                          sx={{
                            p: 1.5,
                            '&:last-child': { pb: 1.5 },
                          }}
                        >
                          <Link
                            href={`/doi/${row.id}`}
                            underline="hover"
                            sx={{
                              fontWeight: 600,
                              display: 'block',
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {row.title}
                          </Link>

                          <Box sx={{ mt: 0.5 }}>
                            <StatusRenderer
                              status={row.approval_status}
                              statusTitle={row.approval_status}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            <CardField label={t('grid.source')}>
                              {row.source_type}
                            </CardField>
                            <CardField label={t('grid.createdOn')}>
                              <DateRenderer value={row.creation} />
                            </CardField>
                            {row.doi_link && (
                              <CardField label={t('grid.doiLink')} fullWidth>
                                {row.doi_link}
                              </CardField>
                            )}
                          </Box>

                          {/* One row of buttons; icons are dropped on phones to fit the text */}
                          <Stack
                            direction="row"
                            spacing={0.75}
                            sx={{ mt: 1.5, flexWrap: 'nowrap' }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              sx={mobileButtonSx}
                              onClick={() =>
                                router.push({
                                  pathname: '/doi/details',
                                  query: { id: row.id },
                                })
                              }
                            >
                              {t('actions.title')}
                            </Button>
                            {isPending && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  sx={mobileButtonSx}
                                  onClick={() => openDecision(row.id, APPROVE)}
                                >
                                  {t('actions.approve')}
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  sx={mobileButtonSx}
                                  onClick={() => openDecision(row.id, REJECT)}
                                >
                                  {t('actions.reject')}
                                </Button>
                              </>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>

                <TablePagination
                  component="div"
                  count={allRows.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={PAGE_SIZE}
                  rowsPerPageOptions={[PAGE_SIZE]}
                  labelRowsPerPage=""
                  sx={{ mt: 1, minWidth: 0, overflow: 'hidden' }}
                />
              </>
            ) : (
              // WIDER SCREENS: the grid, with its own footer pagination
              <DataGrid
                rows={doiList}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: PAGE_SIZE,
                    },
                  },
                  filter: {
                    filterModel: {
                      items: [],
                    },
                  },
                }}
                pageSizeOptions={[PAGE_SIZE]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(
                  rowSelectionModel: GridRowSelectionModel,
                  details: GridCallbackDetails
                ) => {
                  if (!rowSelectionModel) {
                    setSelectedDoi('');
                  } else {
                    setSelectedDoi(rowSelectionModel?.[0]?.toString());
                  }
                }}
                slots={{
                  toolbar: FilterToolbar,
                }}
              />
            )}

            <ApproveRejectDialog
              isApprove={actionType == APPROVE}
              title={actionType}
              isOpen={actionDialogOpen}
              onOk={(formValues: ActionAssignees) => {
                handleAction(formValues);
                setActionType('');
                setActionDialogOpen(false);
              }}
              onCancel={() => {
                setActionType('');
                setActionDialogOpen(false);
              }}
            />

            <Backdrop
              sx={(theme) => ({
                color: '#fff',
                zIndex: theme.zIndex.drawer + 1,
              })}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        </main>
      </div>
    </>
  );
};
