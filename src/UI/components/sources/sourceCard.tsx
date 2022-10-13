import {Paper, Typography, Button, Container, Grid } from '@mui/material';


const SourceCard = ({allReferenceData}) => {
    return(
        <Paper
      sx={{
        display: 'flex',
        justifyContent: 'justify-between',
        alignItems: 'center',
      }}
      >
      
        <Grid container>
        <Grid item lg={4} md={6} sm={12}></Grid>
        <Typography variant="h4" color="primary" py="25px" px="25px"></Typography>
        
            
                
                    <div key={allReferenceData.id}>
                        <div>{allReferenceData.author}</div>
                        <div>{allReferenceData.article_title}</div>
                        <div>{allReferenceData.journal_title}</div>
                        <div>{allReferenceData.citation}</div>
                        <div>{allReferenceData.year}</div>
                        <div>{allReferenceData.published}</div>
                        <div>{allReferenceData.report_type}</div>
                        <div>{allReferenceData.v_data}</div>
                        
                        </div>
                
        </Grid>
        </Paper>
               
    )
}

export default SourceCard