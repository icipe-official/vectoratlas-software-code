import { Box, Container, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { getDatasetMetadata } from '../../state/review/actions/getDatasetMetadata';
import { AppDispatch } from '../../state/store';
import { visuallyHidden } from '@mui/utils';
import router from 'next/router';


const headers = [
    { text: 'Id', id: 'dataset_id' },
    { text: 'Status', id: 'status' },
    { text: 'Updated At', id: 'UpdatedAt' },
  ];

  function DataSetTable():JSX.Element{
    const dataset_list = useAppSelector((state) => state.review.dataset_list);
    const review_options = useAppSelector(
      (state) => state.review.review_dataset
    );
    const dispatch = useDispatch<AppDispatch>();
    const handleClick = (datasetId: string) => {
        dispatch(getDatasetMetadata(datasetId));
        router.push({ pathname: '/review', query: { id: datasetId } });
    
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
                    // onClick={() => handleClick(header.id)}
                    
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
                key={row.dataset_id}
                data-testid={`row ${row.dataset_id}`}
                
              >
                    <TableCell 
                        align="center"
                        onClick={() => handleClick(row.dataset_id)}>
                        {row.dataset_id}
                    </TableCell>
                
                <TableCell>{row.status}</TableCell>
                <TableCell align="center">{row.UpdatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>



      </Grid>

      )

  };

  export default DataSetTable;