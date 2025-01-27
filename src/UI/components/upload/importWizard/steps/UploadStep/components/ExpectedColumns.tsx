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
  { key: 'id', name: 'ID', width: 70, resizable: true },
  { key: 'name', name: 'Name', width: 70, resizable: true },
  { key: 'header', name: 'Header', width: 70, resizable: true },
  {
    key: 'description',
    name: 'Description',
    width: 130,
    resizable: true,
  },
  { key: 'dataType', name: 'Data Type', width: 130, resizable: true },
  {
    key: 'required',
    name: 'Required',
    width: 130,
    resizable: true,
    renderCell: renderCheckbox,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

interface Props {
  state: ImportWizardState;
}

export default function ExpectedColumns({ state }: Props) {
  const { fields } = useSpreadsheetImporter();
  const [targetColumns, setTargetColumns] = useState<RowData[]>([]);

  useEffect(() => {
    const isRequiredDeprecated = (el: Field<any>) => {
      let requiredValidations = el.validations?.filter(
        (el: Field<any>) => el.rule == 'required'
      );
      return requiredValidations == undefined
        ? false
        : requiredValidations?.length > 0;
    };

    const isRequired = (el: Field<any>) => {
      return el.required || false;
    };

    const cols: RowData[] = fields.map((el, idx) => {
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
    state.targetFields = fields;
  }, [fields, state]);
  return (
    <>
      <DataTable rows={targetColumns} columns={columns} />
    </>
  );
}
