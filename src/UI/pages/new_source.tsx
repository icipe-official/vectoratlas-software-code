import { Typography, Paper, Box, Button, Container, Grid } from '@mui/material';
import React from 'react';
import Notauthenticated from '../components/shared/Notauthenticated';
import SourceForm from '../components/sources/source_form';
import { useAppSelector } from '../state/hooks';



function NewSource() {
  const role = useAppSelector((state) => state.auth.roles);
 
  // function handleSubmit(event){
  //   event
  // }
 

  if (role.includes('uploader')) {
    return (
      <>
           
        
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
                  
                  <SourceForm />
                 
                </div>
              </Container>
            </main>
          </div>
          
   
      </>
    );
  }
  return <Notauthenticated name="uploader" />;
}

export default NewSource;
