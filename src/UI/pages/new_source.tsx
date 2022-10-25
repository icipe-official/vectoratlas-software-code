import { Typography, Paper, Button, Container, Grid } from '@mui/material';


import React from 'react'
import SourceForm from '../components/sources/source_form';

function new_source(){
  return (
    <>
    <Paper
      sx={{
        // display: 'flex',
        width: "100%",
        height: "100%",
        justifyContent: 'justify-between',
        alignItems: 'center',
    }}
    >
    <div>
      <main>
      <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
        <div>
        <Typography variant="h4" color="primary" pb={1}><strong>ADD A NEW REFERENCE SOURCE</strong></Typography>
        <br />
        <SourceForm/>
        </div>
        </Container>
        </main>
    </div>
    </Paper>
    </>
  )
}

export default new_source;