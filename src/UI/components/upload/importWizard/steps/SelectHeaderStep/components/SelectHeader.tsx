import React, { useEffect, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import { DataTable } from '../../../components/DataTable';
import * as XLSX from 'xlsx';
import { SelectColumn } from 'react-data-grid';
import { ImportWizardState } from '../../../types';

interface Props {
  state: ImportWizardState;
}

export const SelectHeader = ({ state }: Props) => {
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

  useEffect(() => {
    let header: string[] = [];
    if (data.length > 0 && selectedRows) {
      const rowIndex: number | undefined = selectedRows.values().next().value; // we are only selecting one row
      if (rowIndex != undefined) {
        header = Object.values(data.at(rowIndex));
      }
    }
    state.headers = header;
  }, [selectedRows, data, state]);

  useEffect(() => {
    state.rawRecords = data;
  }, [data, state]);

  return (
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
            setSelectedRows(new Set([value as number]));
            return;
          }
        });
      }}
    />
  );
};
