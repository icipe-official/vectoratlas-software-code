import { useEffect } from 'react';
import {Paper, Typography, Box, Button, Container, Grid } from '@mui/material';
import { getSourceInfo } from '../state/sourceSlice';
import store, { AppDispatch } from '../state/store';
import { useAppSelector } from '../state/hooks';
import { useDispatch } from 'react-redux';
import SingleSource from '../components/sources/singleSource';



function SourcesView(): JSX.Element{
    const source_info = useAppSelector((state) => state.source.source_info)
    const source_info_status = useAppSelector((state) => state.source.source_info_status)

    console.log(source_info);

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(getSourceInfo())

    }, [])
    

    return(
        <>
      <main>
        <Paper>

        <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <Grid 
        data-testid="sourceContainer"
        container
        item
        spacing={0.5}
        lg={8}
        md={12}
        sx={{ justifyContent: 'center' }}
        >
       
        <div>
        <Typography variant="h4" color="primary" pb={3}><strong>LIST OF SOURCES</strong></Typography>
        
        {source_info.map((source_info) => (
          <SingleSource key={source_info.citation}{...source_info} />
          
        ))}
         
      
        </div>  
        </Grid>      
            </Container>
        </Paper>
        </main>
        </>
    );
}


export default SourcesView;




