import React, { useEffect, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import * as XLSX from 'xlsx';
import { SelectColumn } from 'react-data-grid';
import { ImportStepProps } from '../../types';
import { Checkbox, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { CheckBox } from '@mui/icons-material';
import { NavigationPanel } from '../../components/NavigationPanel';

interface Props extends ImportStepProps {}

export const ValidateDataStep = ({ state, onContinue, onBack }: Props) => {
  const workbook = state.workbook;
  const sheetName = state.selectedWorksheetName || '';
  const rawColumns = state.rawColumns;

  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(
    new Set([0])
  );

  useEffect(() => {
    const sheet = workbook?.Sheets[sheetName];
    if (sheet) {
      // Get columns
      if (rawColumns) {
        const cols: any[] = [];
        rawColumns.forEach((col) => {
          // set header as blank since we do not want to preempt that the first row is the header
          cols.push({ key: col, name: '', width: 100, resizable: true });
        });
        setColumns(cols);
      }

      // Get data
      let rowObject = XLSX.utils.sheet_to_json(sheet, {
        header: rawColumns, // 1, // include headers
        raw: false,
        dateNF: 'yyyy-mm-dd',
        defval: '',
      });
      let recs: any[] = [];
      rowObject.forEach((el) => {
        recs.push(el);
      });
      setData(recs);
    }
  }, [rawColumns, sheetName, workbook?.Sheets]);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            sx={{ m: 1 }}
            defaultChecked
            // checked={true}
            // onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        }
        label="Show only records with errors"
      />
      <DataTable
        rowKeyGetter={(row) => data.indexOf(row)}
        className="rdg-static"
        columns={[SelectColumn, ...columns]}
        rows={data}
        selectedRows={selectedRows}
        onSelectedRowsChange={(newRows) => {
          // allow selecting only one row
          newRows.forEach((value) => {
            if (!selectedRows?.has(value as number)) {
              const els = Array.from(selectedRows.values());
              els.push(value as number);
              // setSelectedRows(new Set([value as number]));
              setSelectedRows(new Set(els));
              return;
            }
          });
        }}
      />
      <NavigationPanel onNext={() => onContinue(state)} onPrev={onBack} />
    </>
  );
};
