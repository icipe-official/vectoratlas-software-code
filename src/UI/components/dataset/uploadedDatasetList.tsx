import { Button, Container, Link, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { renderLink } from '../grid-renderer/renderLink';
import { fetchUploadedDatasetList } from '../../api/api';
import { Elevator } from '@mui/icons-material';
import path from 'path';
import { useRouter } from 'next/router';

interface EditToolbarProps {
  // setRows: (newRows: )
}

interface IUploadedDataSet {
  id: string;
  owner: string;
  creation: Date;
  updater: string;
  modified: Date;
  title: string;
  description: string;
  last_upload_date: Date;
  uploaded_file_name: string;
  converted_file_name?: string;
  provided_doi?: string;
  status: string;
  last_status_update_date: Date;
  uploader_email: string;
  uploader_name: string;
  assigned_reviewers?: [];
}

function AddToolbar(props: EditToolbarProps) {
  return (
    <GridToolbarContainer
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button
        color="primary"
        startIcon={<AddIcon />}
        // onClick={handleUploadDataset}
        href="/upload"
      >
        Upload new dataset
      </Button>

      <Button
        color="primary"
        startIcon={<AddIcon />}
        // onClick={handleUploadDataset}
        href="/upload"
      >
        Actions
      </Button>
    </GridToolbarContainer>
  );
}

export const UploadedDatasetList = () => {
  const router = useRouter();
  // const columns: GridColDef<typeof rows[number]>[] = [
  const columns = [
    //{
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 50,
    // },
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <Link
          // href={`/uploaded-dataset/details/${params.value}`}
          onClick={() => {
            router.push({
              pathname: '/uploaded-dataset/details',
              query: { id: params.value },
            });
          }}
        >
          {params.value}
        </Link>
      ),
      valueGetter: (params) => {
        return (
          <Link href={`/uploaded-dataset/${params.row.id}`}>
            {params.row.title}
          </Link>
        );
      },
    },
    // {
    //   field: 'description',
    //   headerName: 'Description',
    //   width: 150,
    //   editable: true,
    // },
    {
      field: 'last_upload_date',
      headerName: 'Uploaded On',
      type: 'dateTime',
      width: 130,
      editable: true,
      valueGetter: (params) => {
        return new Date(params.row.last_upload_date);
      },
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: 'provided_doi',
      headerName: 'Provided DOI',
      type: 'string',
      width: 200,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'string',
      width: 150,
      editable: true,
    },
  ];

  // const rows = [
  //   {
  //     id: 1,
  //     title: 'Arrived compass prepare',
  //     description: 'Jon',
  //     last_upload_date: new Date(2024, 1, 1),
  //     provided_doi: 'http://doi.org/7321.187.096',
  //     status: 'Pending',
  //   },
  //   {
  //     id: 2,
  //     title: 'Promotion an ourselves up otherwise my',
  //     description: 'Cersei',
  //     last_upload_date: new Date(2024, 2, 1),
  //     provided_doi: 'http://doi.org/7321.187.096',
  //     status: 'Under Review',
  //   },
  //   {
  //     id: 3,
  //     title: 'He went such dare good mr fact',
  //     description: 'Jaime',
  //     last_upload_date: new Date(2024, 3, 1),
  //     provided_doi: 'http://doi.org/7321.187.096',
  //     status: 'Pending',
  //   },
  //   {
  //     id: 4,
  //     title: 'Entire any had depend and figure winter',
  //     description: 'Arya',
  //     last_upload_date: new Date(2024, 4, 1),
  //     provided_doi: 'http://doi.org/7321.187.096',
  //     status: 'Approved',
  //   },
  //   {
  //     id: 5,
  //     title: 'Greatly cottage thought fortune no mention he',
  //     description: 'Daenerys',
  //     last_upload_date: new Date(2024, 5, 1),
  //     provided_doi: 'http://doi.org/7321.187.096',
  //     status: 'Approved',
  //   },
  //   {
  //     id: 6,
  //     title: 'Dwelling and speedily ignorant any steepest',
  //     description: null,
  //     last_upload_date: new Date(2024, 6, 1),
  //     provided_doi: 'http://doi.org/6767.454.455',
  //     status: 'Rejected',
  //   },
  //   {
  //     id: 7,
  //     title: 'If wandered relation no surprise of screened doubtful',
  //     description: 'Ferrara',
  //     last_upload_date: new Date(2024, 7, 1),
  //     provided_doi: 'http://doi.org/6565.666.096',
  //     status: 'Rejected',
  //   },
  //   {
  //     id: 8,
  //     title: 'Smallest directly families surprise honoured am an',
  //     description: 'Rossini',
  //     last_upload_date: new Date(2024, 8, 1),
  //     provided_doi: 'http://doi.org/5321.567.056',
  //     status: 'Approved',
  //   },
  //   {
  //     id: 9,
  //     title:
  //       'Led ask possible mistress relation elegance eat likewise debating',
  //     description: 'Harvey',
  //     last_upload_date: new Date(2024, 9, 1),
  //     provided_doi: 'http://doi.org/4828.527.530',
  //     status: 'Under Review',
  //   },
  // ];

  const [data, setData] = useState(new Array<IUploadedDataSet>());

  const loadDatasets = async () => {
    const res: Array<IUploadedDataSet> = await fetchUploadedDatasetList();
    const items: Array<IUploadedDataSet> = [];
    res?.map((el) => {
      items.push({
        id: el.id,
        owner: el.owner,
        creation: el.creation,
        updater: el.updater,
        modified: el.modified,
        title: el.title,
        description: el.description,
        last_upload_date: el.last_upload_date,
        uploaded_file_name: el.uploaded_file_name,
        converted_file_name: el.converted_file_name,
        provided_doi: el.provided_doi,
        status: el.status,
        last_status_update_date: el.last_status_update_date,
        uploader_email: el.uploader_email,
        uploader_name: el.uploader_name,
        assigned_reviewers: el.assigned_reviewers,
      });
    });
    setData(items);
  };

  useEffect(() => {
    const loadData = async () => {
      await loadDatasets();
    };
    loadData();
  }, []);

  return (
    <>
      <div>
        <main>
          <div>
            <Typography variant="h5">Datasets</Typography>

            {/* <AuthWrapper role="editor">
                    <NewsEditor />
                  </AuthWrapper> */}
            <DataGrid
              rows={data}
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
              slots={{
                toolbar: AddToolbar,
              }}
            />
          </div>
        </main>
      </div>
    </>
  );
};
