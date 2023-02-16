import React, { useEffect } from 'react';
import { Box, Button, Container, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getDatasetMetadata } from '../../state/review/actions/getDatasetMetadata';
import { AppDispatch } from '../../state/store';
import { visuallyHidden } from '@mui/utils';
import router from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getDatasetForUser } from '../../state/review/actions/getDatasetForUser';


const headers = [
    { text: 'Id', id: 'dataset_id' },
    { text: 'Status', id: 'status' },
    { text: 'DOI', id: 'doi' },
    { text: 'Updated At', id: 'UpdatedAt' },
  ];

  function DatasetTable(){
    const dataset_list = useAppSelector((state) => state.review.dataset_list);
    console.log(dataset_list)
    const review_options = useAppSelector(
      (state) => state.review.review_dataset
    );

    const dispatch = useAppDispatch();

    const user = useUser();
    useEffect(() => {
      dispatch(getDatasetForUser(user.user?.sub ?? ''));
    }, [dispatch]);

    const handleClick = (datasetId:string) => {
      router.push(`/review?dataset=${datasetId}`);
    };

      return(
        <Grid>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell sx={{ paddingTop: '50' }} key={header.id}>
                  <TableSortLabel
                    data-testid={`sort-${header.id}`}
                    

                    
                  >
                    <Typography variant="h6">{header.text}</Typography>
                  
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataset_list.map((row) => (
              <TableRow
                hover
                key={row.id}
                data-testid={`row ${row.id}`}
                
              >
                    <TableCell 
                        align="center"
                        onClick={() => {handleClick(row.id)}}
                        >{row.id}
                    </TableCell>
                
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.doi}</TableCell>
                <TableCell align="center">{row.UpdatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>



      </Grid>

      )

  };

  export default DatasetTable;