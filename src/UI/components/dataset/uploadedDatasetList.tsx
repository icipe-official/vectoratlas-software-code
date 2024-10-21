import {
  Button,
  CircularProgress,
  Container,
  Link,
  Typography,
} from '@mui/material';
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
import { StatusRenderer } from '../shared/StatusRenderer';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getUploadedDatasets } from '../../state/uploadedDataset/actions/uploaded-dataset.action';

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
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.uploadedDataset.loading);

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
      field: 'status',
      headerName: 'Status',
      type: 'string',
      width: 150,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <StatusRenderer status={params.value} title={params.value} />
      ),
    },
  ];

  const uploadedDatasets = useAppSelector(
    (state) => state.uploadedDataset.uploadedDatasets
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getUploadedDatasets());
    };
    loadData();
  }, [dispatch]);

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
              rows={uploadedDatasets}
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
            {loading && <CircularProgress />}
          </div>
        </main>
      </div>
    </>
  );
};
