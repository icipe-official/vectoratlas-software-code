import { Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';

export default function ValidationErrorsView() {
  const dispatch = useAppDispatch();
  const validationErrors = useAppSelector(
    (state) => state.uploadedDataset.validationErrors
  );
  const isDatasetValid = useAppSelector(
    (state) => state.uploadedDataset.isDatasetValid
  );
  const isProcessingAction = useAppSelector(
    (state) => state.uploadedDataset.isProcessingAction
  );
  const [processedErrors, setProcessedErrors] = useState<any[]>([]);

  const columns = [
    {
      field: 'idx',
      headerName: 'Sr',
      width: 50,
      type: 'number',
    },
    {
      field: 'error_type',
      headerName: 'Error Type',
      width: 250,
      type: 'string',
    },
    {
      field: 'error',
      headerName: 'Affected Rows',
      type: 'string',
      width: 250,
      //   valueGetter: (params: any) => new Date(params.row.last_upload_date),
      //   valueFormatter: (params: any) =>
      //     new Date(params.value).toLocaleDateString(),
    },
  ];

  useEffect(() => {
    const parseErrors = () => {
      const parsedErrors: any[] = [];
      Object.keys(validationErrors || {}).map((key, idx) => {
        let rows: any = [];
        let errors: any = validationErrors[key];
        if (typeof errors == 'string') {
          parsedErrors.push({
            id: (idx + 1).toString(),
            idx: idx + 1,
            error_type: 'General',
            error: errors,
          });
        } else {
          if (errors.length > 0) {
            errors?.map((row: any) => {
              if (typeof row === 'number') {
                rows.push(row);
              } else {
                rows.push(row[0]);
              }
            });
            parsedErrors.push({
              id: (idx + 1).toString(),
              idx: idx + 1,
              error_type: key,
              error: rows.join(','),
            });
          }
        }
      });
      setProcessedErrors(parsedErrors);
    };
    parseErrors();
  }, [validationErrors]);

  if (isDatasetValid !== false) {
    console.log('Validation errors', validationErrors);
    return null;
  }
  return (
    <div>
      <Box
        sx={{
          alignSelf: 'center',
          flexGrow: 1,
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* <CheckCircleOutlineIcon
            color="error"
            sx={{ width: 30, height: 30, alignSelf: 'center' }}
          /> */}
          <Typography color="error" variant="h6">
            Dataset contains errors
          </Typography>
        </div>
      </Box>
      <DataGrid
        rows={processedErrors}
        columns={columns}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}
