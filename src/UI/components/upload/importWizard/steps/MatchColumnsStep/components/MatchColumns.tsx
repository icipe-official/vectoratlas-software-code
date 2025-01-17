import React, { useEffect } from 'react';
import { ColumnMap, ImportWizardState } from '../../../types';
import { Card, CardContent } from '@mui/material';
import { RenderEditCellProps } from 'react-data-grid';

// import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MatchColumnItem } from './MatchColumnItem';

const columns: GridColDef<typeof rows[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
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
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
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
}

export const MatchColumns = ({ state }: Props) => {
  const columnMap = state.columnMap;
  const headers = state.headers;
  const rawColumns = state.rawColumns;

  useEffect(() => {
    if (columnMap.length > 0) {
      return;
    }
    const mp: ColumnMap[] = [];
    headers?.map((el) => {
      mp.push({ source: el, target: '' });
    });
    state.columnMap = mp;
  }, [columnMap.length, headers, state]);

  const validateStep = () => {
    const validateDuplicateTargets = () => {
      // check no duplicate target columns
      let targets = columnMap.map((el) => el.target);
      let duplicates = targets.filter(
        (item, index) => targets.indexOf(item) !== index
      );
      if (duplicates.length > 0) {
        throw `Target column ${duplicates[0]} has more than one match. A target column can only be matched once`;
      }
      // check mandatory columns
    };
  };

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
          />
          {rawColumns.map((el) => (
            <MatchColumnItem key={el} state={state} rawColumn={el} />
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};
