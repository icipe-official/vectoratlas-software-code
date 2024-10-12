import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { fetchUploadedDatasetLogsByDatasetAuthenticated } from '../../api/api';

interface IUploadedDataSetLog {
  id: string;
  action_type: string;
  action_date: Date;
  action_details: string;
  action_taker: string;
}

interface IDatasetLogListProps {
  datasetId: string;
}

export const UploadedDatasetLogList = (props: IDatasetLogListProps) => { 
  const columns: GridColDef<IUploadedDataSetLog>[] = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 40,
    // },
    {
      field: 'action_type',
      headerName: 'Action Type',
      width: 200,
      editable: false,
    },
    {
      field: 'action_date',
      headerName: 'Action Date',
      type: 'date',
      width: 150,
      editable: false,
      valueGetter: (params) => {
        return new Date(params.row.action_date);
      },
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: 'action_details',
      headerName: 'Action Details',
      type: 'string',
      width: 400,
      editable: false,
    },
    {
      field: 'action_taker',
      headerName: 'Performed by',
      type: 'string',
      width: 200,
      editable: false,
    },
  ];

  const [data, setData] = useState(new Array<IUploadedDataSetLog>());

  const loadDatasetLogs = async () => {
    const res: Array<IUploadedDataSetLog> =
      await fetchUploadedDatasetLogsByDatasetAuthenticated(props.datasetId);
    const items: Array<IUploadedDataSetLog> = [];
    res?.map((el) => {
      items.push({
        id: el.id,
        action_type: el.action_type,
        action_date: el.action_date,
        action_details: el.action_details,
        action_taker: el.action_taker,
      });
    });
    setData(items);
  };

  useEffect(() => {
    const loadData = async () => {
      await loadDatasetLogs();
    };
    loadData();
  }, []);

  return (
    <div>
      <DataGrid
        columns={columns}
        rows={data}
        slots={{
          toolbar: GridToolbar,
        }}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  field: 'age',
                  operator: '>',
                  value: '20',
                },
              ],
            },
          },
        }}
      />
    </div>
  );
};
