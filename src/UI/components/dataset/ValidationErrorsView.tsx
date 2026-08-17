import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { useTranslations } from 'next-intl';
import { isArray, isObject } from 'lodash';
import { isJsonObject } from '../../utils/utils';
import { idText } from 'typescript';

export default function ValidationErrorsView() {
  const t = useTranslations('UploadedDatasetDetailPage');

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
  const [groupErrors, setGroupErrors] = useState<boolean>(false);
  const [processedErrors, setProcessedErrors] = useState<any[]>([]);

  // const validationErrorsQueued = useAppSelector(
  //   (state) => state.ingestJob.error
  // );

  const columns = [
    {
      field: 'idx',
      headerName: t('validationDialog.errorGrid.sr'),
      width: 50,
      type: 'number',
    },
    {
      field: 'row',
      headerName: t('validationDialog.errorGrid.row'),
      width: 50,
      type: 'number',
    },
    {
      field: 'source_id',
      headerName: t('validationDialog.errorGrid.sourceId'),
      width: 100,
      type: 'string',
    },
    {
      field: 'error_type',
      headerName: t('validationDialog.errorGrid.errorType'),
      width: 150,
      type: 'string',
    },
    {
      field: 'error',
      headerName: t('validationDialog.errorGrid.errorDescription'),
      type: 'string',
      width: 500,
      //   valueGetter: (params: any) => new Date(params.row.last_upload_date),
      //   valueFormatter: (params: any) =>
      //     new Date(params.value).toLocaleDateString(),
    },
  ];

  const columns2 = [
    {
      field: 'idx',
      headerName: t('validationDialog.errorGrid.sr'),
      width: 50,
      type: 'number',
    },
    {
      field: 'source_id',
      headerName: t('validationDialog.errorGrid.sourceId'),
      width: 250,
      type: 'string',
    },
    {
      field: 'error_type',
      headerName: t('validationDialog.errorGrid.errorType'),
      width: 250,
      type: 'string',
    },
    {
      field: 'error',
      headerName: t('validationDialog.errorGrid.affectedRows'),
      type: 'string',
      width: 250,
      //   valueGetter: (params: any) => new Date(params.row.last_upload_date),
      //   valueFormatter: (params: any) =>
      //     new Date(params.value).toLocaleDateString(),
    },
  ];

  const [groupBy, setGroupBy] = useState<string>('Error Type');

  const handleGroupByChange = (event: any) => {
    setGroupBy(event.target.value);
  };

  useEffect(() => {
    const parseErrors = () => {
      let parsedErrors: any[] = [];
      if (Object.values(validationErrors).length > 0) {
        const groupedRows = Object.entries(validationErrors).flatMap(
          ([type, items]) =>
            (items as any[]).map((item, index) => ({
              row: item.row,
              error_type: type,
              error: item.error,
              source_id: item.source_id,
            }))
        );
        console.log(groupedRows);
        // sort by row numbers
        const sortedByRow = groupedRows.sort((a, b) => a.row - b.row);
        sortedByRow.map((el, idx) => {
          ((parsedErrors || []) as any[]).push({
            ...el,
            id: idx,
            idx: idx + 1,
          });
        });
        setProcessedErrors(parsedErrors);
      } else {
        if (validationErrors instanceof String) {
          // parsedErrors = validationErrors.toString();
          parsedErrors = [
            {
              id: 1,
              row: '',
              error_type: 'System Error',
              error: validationErrors.toString(),
            },
          ];
        } else {
          parsedErrors = [];
          // // parsedErrors =
          // // Object.values(validationErrors).length > 0
          // //   ? [JSON.stringify(validationErrors)]
          // //   : [];

          // if (Object.values(validationErrors).length > 0) {
          //   parsedErrors = [
          //     {
          //       id: 1,
          //       row: '',
          //       error_type: 'System Error',
          //       error: JSON.stringify(validationErrors),
          //     },
          //   ];
          // } else {
          //   parsedErrors = [];
          // }
        }
        setProcessedErrors(parsedErrors);
      }

      // if (isArray(validationErrors)) {
      //   const groupedRows = Object.entries(validationErrors).flatMap(
      //     ([type, items]) =>
      //       (items as any[]).map((item, index) => ({
      //         row: item.row,
      //         error_type: type,
      //         error: item.error,
      //       }))
      //   );
      //   console.log(groupedRows);
      //   // sort by row numbers
      //   const sortedByRow = groupedRows.sort((a, b) => a.row - b.row);
      //   sortedByRow.map((el, idx) => {
      //     (parsedErrors as any[]).push({ ...el, id: idx, idx: idx + 1 });
      //   });
      //   setProcessedErrors(parsedErrors);
      // } else {
      //   if (validationErrors instanceof String) {
      //     // parsedErrors = validationErrors.toString();
      //     parsedErrors = [
      //       {
      //         id: 1,
      //         row: '',
      //         error_type: 'System Error',
      //         error: validationErrors.toString(),
      //       },
      //     ];
      //   } else {
      //     // parsedErrors =
      //     // Object.values(validationErrors).length > 0
      //     //   ? [JSON.stringify(validationErrors)]
      //     //   : [];

      //     if (Object.values(validationErrors).length > 0) {
      //       parsedErrors = [
      //         {
      //           id: 1,
      //           row: '',
      //           error_type: 'System Error',
      //           error: JSON.stringify(validationErrors),
      //         },
      //       ];
      //     } else {
      //       parsedErrors = [];
      //     }
      //   }
      //   setProcessedErrors(parsedErrors);
      // }
      return;
      // Object.keys(validationErrors || {}).map((key, idx) => {
      //   let rows: any = [];
      //   let errors: any = validationErrors[key];
      //   if (typeof errors == 'string') {
      //     parsedErrors.push({
      //       id: (idx + 1).toString(),
      //       idx: idx + 1,
      //       error_type: 'General',
      //       error: errors,
      //     });
      //   } else {
      //     if (errors.length > 0) {
      //       // const groupedRows = Object.entries(validationErrors).flatMap(
      //       //   ([type, items]) =>
      //       //     items.map((item, index) => ({
      //       //       row: item.row,
      //       //       error_type: type,
      //       //       error: item.error,
      //       //     }))
      //       // );

      //       // console.log(groupedRows);
      //       // sort by row numbers
      //       const sortedByRow = groupedRows.sort((a, b) => a.row - b.row);
      //       sortedByRow.map((el, idx) => {
      //         parsedErrors.push({ ...el, id: idx, idx: idx + 1 });
      //       });
      //       // parsedErrors.push(groupedRows);
      //       return;

      //       if (groupBy == 'Error Type') {
      //         errors?.map(
      //           (row: any) => {
      //             if (Array.isArray(row)) {
      //               rows.push(row[0]);
      //             } else if (isJsonObject(row)) {
      //               rows.push(JSON.stringify(row));
      //             } else rows.push(row.toString());
      //           }
      //           // if (typeof row === 'number' || typeof row === 'string') {
      //           //   rows.push(row);
      //           // } else {
      //           //   rows.push(row[0]);
      //           // }
      //         );
      //         const rowIdx = parseErrors.length + 1;
      //         parsedErrors.push({
      //           id: rowIdx.toString(), // (idx + 1).toString(),
      //           idx: rowIdx, // idx + 1,
      //           error_type: key,
      //           error: rows.join(','),
      //         });
      //       }
      //       // if (groupBy === 'Row') {
      //       //   // Get unique rows
      //       //   const uniqueRows: number[] = [];
      //       //   Object.keys(validationErrors || {}).map((key, idx) => {
      //       //     validationErrors[key].map((err) => {
      //       //       if (!uniqueRows.includes(err['row'])) {
      //       //         uniqueRows.push(err['row']);
      //       //       }
      //       //     });
      //       //   });

      //       //   errors?.map(
      //       //     (row: any) => {
      //       //       if (Array.isArray(row)) {
      //       //         rows.push(row[0]);
      //       //       } else if (isJsonObject(row)) {
      //       //         rows.push(JSON.stringify(row));
      //       //       } else rows.push(row.toString());
      //       //     }
      //       //     // if (typeof row === 'number' || typeof row === 'string') {
      //       //     //   rows.push(row);
      //       //     // } else {
      //       //     //   rows.push(row[0]);
      //       //     // }
      //       //   );
      //       //   const rowIdx = parseErrors.length + 1;
      //       //   parsedErrors.push({
      //       //     id: rowIdx.toString(), // (idx + 1).toString(),
      //       //     idx: rowIdx, // idx + 1,
      //       //     error_type: key,
      //       //     error: rows.join(','),
      //       //   });
      //       // }
      //     }
      //   }
      // });
      // setProcessedErrors(parsedErrors);
    };
    parseErrors();
  }, [validationErrors]);

  if (isDatasetValid !== false) {
    // console.log('Validation errors', validationErrors);
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
            {t('validationDialog.datasetHasErrors')}
          </Typography>
        </div>
      </Box>
      <FormControl fullWidth size="small" style={{ display: 'none' }}>
        <InputLabel id="country-label">
          {t('validationDialog.groupErrorsBy')}
        </InputLabel>

        <Select
          labelId="country-label"
          id="country-select"
          value={groupBy}
          label="Country"
          onChange={handleGroupByChange}
        >
          <MenuItem value="Error Type">
            {t('validationDialog.errorType')}
          </MenuItem>
          <MenuItem value="Row">{t('validationDialog.row')}</MenuItem>
        </Select>
      </FormControl>
      <DataGrid
        rows={processedErrors}
        columns={columns}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}
