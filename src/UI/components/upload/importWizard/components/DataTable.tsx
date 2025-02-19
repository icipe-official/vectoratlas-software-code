import React from 'react';
import DataGrid, { DataGridProps } from 'react-data-grid';

interface Props<Data> extends DataGridProps<Data> {
  rowHeight?: number;
  hiddenHeader?: boolean;
}

export const DataTable = <Data,>({ className, ...props }: Props<Data>) => {
  //   const { rtl } = useRsi();
  const rtl = false;
  console.log('Cols: ', props.columns);
  return (
    <DataGrid
      className={'rdg-light ' + className || ''}
      direction={rtl ? 'rtl' : 'ltr'}
      {...props}
    />
  );
};
