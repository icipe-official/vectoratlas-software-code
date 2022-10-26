import { Typography, Paper, Button, Container, Grid } from '@mui/material';
import { includes } from 'ol/array';
import React from 'react';
import Notauthenticated from '../components/shared/Notauthenticated';
import SourceForm from '../components/sources/source_form';
import { useAppSelector } from '../state/hooks';

function NewSource() {
  const role = useAppSelector((state) => state.auth.roles);

  if (role.includes('uploader')) {
    return (
      <>
        <Paper
          sx={{
            // display: 'flex',
            width: '100%',
            height: '100%',
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
                  <Typography variant="h4" color="primary" pb={1}>
                    <strong>ADD A NEW REFERENCE SOURCE</strong>
                  </Typography>
                  <br />
                  <SourceForm />
                </div>
              </Container>
            </main>
          </div>
        </Paper>
      </>
    );
  }
  return <Notauthenticated name="uploader" />;
}

export default NewSource;
