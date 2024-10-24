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
  const columns: GridColDef<typeof rows[number]>[] = [
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

  const rows = [
    {
      id: 1,
      action_type: 'New Upload',
      action_date: new Date(2024, 1, 1),
      action_details:
        'How promotion excellent curiosity yet attempted happiness',
      action_taker: 'stevenyaga@gmail.com',
    },
    {
      id: 2,
      action_type: 'Dataset reupload',
      action_date: new Date(2024, 2, 1),
      action_details:
        'Adieus except say barton put feebly favour him. Entreaties unpleasant sufficient few pianoforte discovered uncommonly ask.',
      action_taker: 'stevenyaga@gmail.com',
    },
    {
      id: 3,
      action_type: 'Request for adjustment',
      action_date: new Date(2024, 3, 1),
      action_details:
        'Greatest properly off ham exercise all. Unsatiable invitation its possession nor off. All difficulty estimating unreserved increasing the solicitude',
      action_taker: 'stevenyaga@gmail.com',
    },
    {
      id: 4,
      action_type: 'Reviewed',
      action_date: new Date(2024, 4, 1),
      action_details:
        'So by colonel hearted ferrars. Draw from upon here gone add one. He in sportsman household otherwise it perceived instantly',
      action_taker: 'stevenyaga@gmail.com',
    },
    {
      id: 5,
      action_type: 'Approved',
      action_date: new Date(2024, 5, 1),
      action_details:
        'Sense child do state to defer mr of forty. Become latter but nor abroad wisdom waited. Was delivered gentleman acuteness but daughters',
      action_taker: 'stevenyaga@gmail.com',
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
