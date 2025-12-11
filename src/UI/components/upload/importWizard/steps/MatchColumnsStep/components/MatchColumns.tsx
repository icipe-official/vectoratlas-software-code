import React, { useEffect, useState } from 'react';
import { ColumnMap, Field, ImportWizardState } from '../../../types';
import {
  Backdrop,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { RenderEditCellProps } from 'react-data-grid';

// import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MatchColumnItem } from './MatchColumnItem';
import lavenstein from 'js-levenshtein';
import { useSpreadsheetImporter } from '../../../hooks/useSpreadsheetImporter';
import { match } from 'assert';
import LoadingMask from '../../../components/LoadingMask';


const columns: GridColDef<(typeof rows)[number]>[] = [{ field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'gender',
    headerName: 'Age',
    type: 'singleSelect',
    valueOptions: ['M', 'F'],
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function DataGridDemo() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

function TextEditor<TRow, TSummaryRow>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<TRow, TSummaryRow>) {
  return (
    <input
      //   className={textEditorClassname}
      //   ref={autoFocusAndSelect}
      value={row[column.key as keyof TRow] as unknown as string}
      onChange={(event) =>
        onRowChange({ ...row, [column.key]: event.target.value })
      }
      onBlur={() => onClose(true, false)}
    />
  );
}

interface Props {
  state: ImportWizardState;
  autoMapDistance: number;
  autoMapHeaders: boolean;
  onLoadMatchComplete?: () => void;
}

interface ColumnMatch {
  distance: number;
  targetColumn: string;
}

export const MatchColumns = ({
  state,
  autoMapDistance,
  autoMapHeaders,
  onLoadMatchComplete,
}: Props) => {
  // const columnMap = state.columnMap;
  // const headers = state.headers;
  const rawColumns = state.rawColumns;
  const vals = useSpreadsheetImporter();
  const [columnMap, setColumnMap] = useState<ColumnMap[]>(state.columnMap);
  const [loading, setLoading] = useState(true);
  const [sortedTargetFields, setSortedTargetFields] = useState<Field<any>[]>();
  const { targetFields } = useSpreadsheetImporter();

  // useEffect(() => {
  //   if (columnMap.length > 0) {
  //     return;
  //   }
  //   const mp: ColumnMap[] = [];
  //   headers?.map((el) => {
  //     mp.push({ source: el, target: '' });
  //   });
  //   state.columnMap = mp;
  // }, [columnMap.length, headers, state]);

  useEffect(() => {
    targetFields.sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });
    setSortedTargetFields(targetFields);
  }, [targetFields]);

  useEffect(() => {
    setColumnMap(state.columnMap);
  }, [state.columnMap]);

  useEffect(() => {
    setLoading(true);
    if (autoMapHeaders) {
      // Attempt to match columns
      const colMap = [...columnMap];
      colMap.map((el) => {
        const matches: ColumnMatch[] = [];
        for (const targetField of targetFields) {
          const distance = lavenstein(el.source, targetField.key);
          if (distance <= autoMapDistance) {
            // el.target = rawCol;
            matches.push({ distance: distance, targetColumn: targetField.key });
            // break;
          }
        }
        if (matches.length > 0) {
          // if there were matches pick the one with the least distance
          matches.sort((a, b) => a.distance - b.distance);
          el.target = matches[0].targetColumn;
        }
      });
      setColumnMap(colMap);
    }
    setLoading(false);
  }, [
    autoMapDistance,
    autoMapHeaders,
    columnMap,
    state.columnMap,
    state.rawColumns,
    targetFields,
  ]);

  return (
    <Box
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyItems: 'center',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Card variant="outlined" style={{ width: '100%' }}>
        <CardContent>
          <MatchColumnItem
            key={'title'}
            state={state}
            rawColumn={''}
            isHeader
            orderedTargetFields={sortedTargetFields || []}
            index={0}
          />
          {loading && (
            <Box
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {state.rawColumns
            .filter((el) => el) // remove empty columns
            .map((el, idx) => {
              const mp = columnMap.filter((mp) => mp.source == el); // get the mapped target
              if (idx === state.rawColumns.length - 1) {
                if (onLoadMatchComplete) {
                  onLoadMatchComplete();
                }
              }
              return (
                <MatchColumnItem
                  key={idx}
                  state={state}
                  rawColumn={mp.length > 0 ? mp[0].source : ''}
                  targetValue={mp.length > 0 ? mp[0].target : ''}
                  orderedTargetFields={sortedTargetFields || []}
                  index={idx + 1}
                />
              );
            })}
        </CardContent>
      </Card>
      <LoadingMask open={loading} />
    </Box>
  );
};
