import React, { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import { Field, ImportWizardState } from '../../../types';
import { DataTable } from '../../../components/DataTable';
import { Column, RenderCellProps } from 'react-data-grid';
import { useSpreadsheetImporter } from '../../../hooks/useSpreadsheetImporter';

const renderCheckbox = (props: RenderCellProps<any, any>) => {
  return <Checkbox size="small" checked={props.row.required} />;
};

type RowData = {
  id: number;
  name: string;
  header: string;
  description?: string;
  dataType: string;
  required: boolean;
};

type GridViewProps = {
  records: RowData[];
};

const columns: Column<RowData>[] = [
  { key: 'id', name: 'ID', width: 70, resizable: false },
  { key: 'name', name: 'Name', width: 70, resizable: false },
  { key: 'header', name: 'Header', width: 70, resizable: false },
  {
    key: 'description',
    name: 'Description',
    width: 130,
    resizable: false,
  },
  {
    key: 'required',
    name: 'Required',
    width: 130,
    resizable: false,
    renderCell: renderCheckbox,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

interface Props {
  state: ImportWizardState;
}

export default function ExpectedColumns({ state }: Props) {
  const { targetFields } = useSpreadsheetImporter();
  const [targetColumns, setTargetColumns] = useState<RowData[]>([]);

  useEffect(() => {
    const isRequired = (el: Field<any>) => {
      return el.required || false;
    };

    const cols: RowData[] = targetFields.map((el, idx) => {
      const required = isRequired(el);
      return {
        id: idx,
        name: el.key,
        header: el.label,
        description: el.description,
        dataType: 'String',
        required: required,
      };
    });
    setTargetColumns(cols);
    // state.targetFields = fields;
  }, [targetFields, state]);
  return (
    <>
      <DataTable rows={targetColumns} columns={columns} />
    </>
  );
}
