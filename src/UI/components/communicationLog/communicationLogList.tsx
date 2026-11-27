import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
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
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getAllCommunicationLogs } from '../../state/communicationLog/actions/communicationLog.actions';
import { StatusRenderer } from '../shared/statusRenderer';
import DateRenderer from '../shared/dateRenderer';
import { useTranslations } from 'next-intl';

// Faded grid line colour, used for rows, cells, headers and the outer border
const FADED_LINE = 'rgba(0, 0, 0, 0.08)';

// Toolbar: filter on the left, Compose on the right
function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
      }}
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

// Full-width wrapper for phones: spans the whole viewport and bypasses the
// parent container's padding. A small inner gutter keeps content off the edge.
const mobileWrapperSx = {
  width: '100vw',
  marginLeft: 'calc(50% - 50vw)',
  px: 1,
  boxSizing: 'border-box',
  minWidth: 0,
} as const;

export const CommunicationLogList = () => {
  const t = useTranslations('CommunicationListPage');

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedCommunicationLogId, setSelectedCommunicationLogId] =
    useState('');
  const communicationLogList = useAppSelector(
    (state) => state.communicationLog.communicationLogs
  );

  // Phone-width check (matches MUI's sm breakpoint)
  const isMobile = useMediaQuery('(max-width:599.95px)');

  const columns: GridColDef[] = [
    {
      field: 'subject',
      headerName: t('grid.subject'),
      // Fixed width on desktop; flexible on phones so it takes the leftover space
      ...(isMobile ? { flex: 1, minWidth: 110 } : { width: 330 }),
      editable: false,
      valueGetter: (params: any) => params.row.subject || '',
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="text"
          onClick={(e) => {
            e.preventDefault();
            router.push({
              pathname: '/communication-log/details',
              query: { id: params.row.id },
            });
          }}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start',
            textAlign: 'left',
            p: 0,
            minWidth: 0,
            whiteSpace: 'normal',
            lineHeight: 1.3,
            fontSize: isMobile ? '0.8rem' : undefined,
          }}
        >
          {params.row.subject}
        </Button>
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
      width: isMobile ? 105 : 170,
      valueGetter: (params: any) => new Date(params.row.communication_date),
      renderCell: ({ row }: { row: any }) =>
        isMobile ? (
          // Phones: date only, so the column stays narrow
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            {new Date(row.communication_date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
        ) : (
          <DateRenderer value={row.communication_date} />
        ),
    },
    {
      field: 'sent_status',
      headerName: t('grid.status'),
      type: 'string',
      width: isMobile ? 85 : 150,
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
    <div>
      <main>
        {/* On phones this block spans the full screen width.
            On wider screens it keeps its normal width. */}
        <Box sx={isMobile ? mobileWrapperSx : undefined}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, textAlign: 'left', mt: isMobile ? 1 : 0 }}
          >
            {t('title')}
          </Typography>

          <DataGrid
            rows={communicationLogList || []}
            columns={columns}
            // Phones hide the Message Type column to leave room for the rest
            columnVisibilityModel={{ message_type: !isMobile }}
            // Phones hide the ⋮ column menus, which take up header space.
            // Sorting still works by tapping the header.
            disableColumnMenu={isMobile}
            // Phones let the grid grow with its rows, so the whole page scrolls
            autoHeight={isMobile}
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
            pageSizeOptions={[5, 10, 25]}
            // Checkboxes take too much width on phones, so they're desktop only
            checkboxSelection={!isMobile}
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
            // Faded grid lines, plus wrapping headers on phones
            sx={{
              '--DataGrid-rowBorderColor': FADED_LINE,
              '--DataGrid-containerBorderColor': FADED_LINE,
              '& .MuiDataGrid-cell': {
                borderBottomColor: FADED_LINE,
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottomColor: FADED_LINE,
              },
              '& .MuiDataGrid-columnSeparator': {
                color: FADED_LINE,
              },
              '& .MuiDataGrid-footerContainer': {
                borderTopColor: FADED_LINE,
              },
              // Headers wrap onto two lines instead of being cut off
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                lineHeight: 1.2,
                fontSize: isMobile ? '0.75rem' : undefined,
              },
              '& .MuiDataGrid-columnHeader': {
                px: isMobile ? 0.5 : undefined,
              },
            }}
          />
        </Box>
      </main>
    </div>
  );
};
