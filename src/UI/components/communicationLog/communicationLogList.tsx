import {
  Box,
  Button,
  Card,
  CardContent,
  FormLabel,
  Link,
  Stack,
  TablePagination,
  Typography,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getAllCommunicationLogs } from '../../state/communicationLog/actions/communicationLog.actions';
import { StatusRenderer } from '../shared/statusRenderer';
import DateRenderer from '../shared/dateRenderer';
import { useTranslations } from 'next-intl';
import { ComposeMessageForm } from '../email/composeForm';
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

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <div>
        <GridToolbarFilterButton />
      </div>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        href="/communication-log/compose"
      >
        Compose
      </Button>
    </GridToolbarContainer>
  );
}

// Card view page size, matching the DOI list
const PAGE_SIZE = 10;

// Full-bleed wrapper for phones: spans the whole viewport, so any padding
// from the parent container is bypassed. Small inner gutter keeps cards off the edge.
const mobileWrapperSx = {
  width: '100vw',
  marginLeft: 'calc(50% - 50vw)',
  px: 1,
  boxSizing: 'border-box',
  minWidth: 0,
} as const;

function FilterToolbar() {
  return (
    <div>
      <GridToolbarFilterButton />
    </div>
  );
}

// One label/value row inside a card. A faded horizontal line sits underneath
// (none on the last row) and a faded vertical line separates the two columns.
const FieldRow = ({
  label,
  children,
  isLast = false,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <Box
    sx={{
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      gap: 2,
      py: 1,
      '&::after': isLast
        ? { display: 'none' }
        : {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '1px',
            background:
              'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)',
          },
    }}
  >
    <FormLabel
      filled
      color="error"
      sx={{
        flex: '0 0 40%',
        minWidth: 0,
        fontWeight: 'bold',
        overflowWrap: 'anywhere',
        alignSelf: 'center',
      }}
    >
      {label}
    </FormLabel>

    {/* Vertical faded separator between the label and value columns */}
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        minWidth: 0,
        wordBreak: 'break-word',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '-16px',
          top: 0,
          bottom: 0,
          width: '1px',
          background:
            'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.25), transparent)',
        },
      }}
    >
      {children}
    </Box>
  </Box>
);

export const CommunicationLogList = () => {
  const t = useTranslations('CommunicationListPage');

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedCommunicationLogId, setSelectedCommunicationLogId] =
    useState('');
  const [page, setPage] = useState(0);
  const communicationLogList = useAppSelector(
    (state) => state.communicationLog.communicationLogs
  );

  // Phone-width check (matches MUI's sm breakpoint)
  const isMobile = useMediaQuery('(max-width:599.95px)');

  // Card-view paging
  const allRows: any[] = communicationLogList || [];
  const pagedRows = allRows.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  // Back to page 1 when the list reloads, so the user never lands on an empty page
  useEffect(() => {
    setPage(0);
  }, [communicationLogList]);

  const columns: GridColDef[] = [
    {
      field: 'subject',
      headerName: t('grid.subject'),
      width: 330,
      editable: false,
      valueGetter: (params: any) => params.row.subject || '',
      renderCell: (params: GridRenderCellParams) => (
        <Link
          component="button"
          variant="body2"
          onClick={(e) => {
            e.preventDefault();
            router.push({
              pathname: '/communication-log/details',
              query: { id: params.row.id },
            });
          }}
          style={{ cursor: 'pointer', textAlign: 'left' }}
        >
          {params.row.subject}
        </Link>
      ),
    },
    {
      field: 'message_type',
      headerName: t('grid.messageType'),
      width: 200,
      editable: false,
    },
    {
      field: 'communication_date',
      headerName: t('grid.date'),
      type: 'dateTime',
      width: 170,
      valueGetter: (params: any) => new Date(params.row.communication_date),
      renderCell: ({ row }: { row: any }) => (
        <DateRenderer value={row.communication_date} />
      ),
    },
    {
      field: 'sent_status',
      headerName: t('grid.status'),
      type: 'string',
      width: 150,
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <StatusRenderer status={params.value} statusTitle={params.value} />
      ),
    },
  ];

  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getAllCommunicationLogs());
    }
  }, [token, dispatch]);

  return (
    <>
      <div>
        <main>
          <div>
            <Typography variant="h5">{t('title')}</Typography>
            <DataGrid
              rows={communicationLogList || []}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
                sorting: {
                  sortModel: [{ field: 'communication_date', sort: 'desc' }],
                },
              }}
              // filter: {
              //   filterModel: {
              //     items: [
              //       {
              //         id: 1,
              //         field: 'sent_status',
              //         operator: 'equals',
              //         value: 'Pending',
              //       },
              //     ],
              //   },
              // },

              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(
                rowSelectionModel: GridRowSelectionModel,
                details: GridCallbackDetails
              ) => {
                if (!rowSelectionModel) {
                  setSelectedCommunicationLogId('');
                } else {
                  setSelectedCommunicationLogId(
                    rowSelectionModel?.[0]?.toString()
                  );
                }
              }}
              slots={{
                toolbar: CustomToolbar,
              }}
            />
            {isMobile ? (
              // PHONE: title, cards and pagination share one full-width wrapper
              <Box sx={mobileWrapperSx}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, textAlign: 'left', mt: 1 }}
                >
                  {t('title')}
                </Typography>

                <Stack spacing={1} sx={{ mt: 1.5, minWidth: 0, width: '100%' }}>
                  {pagedRows.map((row: any) => (
                    <Card
                      key={row.id}
                      variant="outlined"
                      sx={{
                        width: '100%',
                        minWidth: 0,
                        borderRadius: '12px',
                      }}
                    >
                      <CardContent
                        sx={{
                          px: 1.25,
                          pt: 1.25,
                          pb: '8px !important',
                        }}
                      >
                        <Link
                          onClick={() =>
                            router.push({
                              pathname: '/communication-log/details',
                              query: { id: row.id },
                            })
                          }
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            lineHeight: 1.3,
                            display: 'block',
                            cursor: 'pointer',
                            overflowWrap: 'anywhere',
                            pb: 0.5,
                          }}
                        >
                          {row.subject}
                        </Link>

                        <Box sx={{ mt: 0.5 }}>
                          <FieldRow label={t('grid.messageType')}>
                            {row.message_type}
                          </FieldRow>
                          <FieldRow label={t('grid.date')}>
                            <DateRenderer value={row.communication_date} />
                          </FieldRow>
                          <FieldRow label={t('grid.status')} isLast>
                            <StatusRenderer
                              status={row.sent_status}
                              statusTitle={row.sent_status}
                            />
                          </FieldRow>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            ) : (
              // WIDER SCREENS: title and grid, unchanged apart from the title style
              <>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, textAlign: 'left' }}
                >
                  {t('title')}
                </Typography>
                <DataGrid
                  rows={communicationLogList}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[10]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(
                    rowSelectionModel: GridRowSelectionModel,
                    details: GridCallbackDetails
                  ) => {
                    if (!rowSelectionModel) {
                      setSelectedCommunicationLogId('');
                    } else {
                      setSelectedCommunicationLogId(
                        rowSelectionModel?.[0]?.toString()
                      );
                    }
                  }}
                  slots={{
                    toolbar: FilterToolbar,
                  }}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};
