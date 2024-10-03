import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';

export const UploadedDatasetLog = () => {
  const [data, setData] = useState([]);
  const columns: GridColDef<typeof rows[number]>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 40,
    },
    {
      field: 'action_type',
      headerName: 'Action Type',
      width: 200,
      editable: true,
    },
    {
      field: 'action_date',
      headerName: 'Action Date',
      type: 'date',
      width: 150,
      editable: true,
    },
    {
      field: 'action_details',
      headerName: 'Action Details',
      type: 'string',
      width: 400,
      editable: true,
    },
    {
      field: 'action_taker',
      headerName: 'Performed by',
      type: 'string',
      width: 200,
      editable: true,
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
  return (
    <div>
      <DataGrid
        columns={columns}
        rows={rows}
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
