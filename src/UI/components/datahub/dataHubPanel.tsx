import { Avatar, Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../layout/sectionPanel';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { useAppSelector } from '../../state/hooks';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Grid, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

function DataHubPanel(props: any) {
  return (
    <div>
      <main>
        <Container>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <div>
                      Welcome ! What operation do
                      you want to perform ?
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={6}>
                <h3
                  color="primary"
                  style={{ textAlign: 'center', marginBottom: 0 }}
                >
                  Upload Model
                </h3>
                <div data-testid='upload_model'
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginTop: 15 }}>
                    <Link href="/model_upload" passHref>
                      <Image
                        src="/upload.png"
                        width={100}
                        height={100}
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>
                  </div>
                </div>
              </Grid>
              <Grid item sm={12} md={6}>
                <h3
                  color="primary"
                  style={{ textAlign: 'center', marginBottom: 0 }}
                >
                  Upload Data
                </h3>
                <div data-testid='upload_data'
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginTop: 15 }}>
                    <Link href="/upload" passHref>
                      <Image
                        src="/upload2.png"
                        width={100}
                        height={100}
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>
                  </div>
                </div>
              </Grid>
            </Grid>
        </Container>
      </main>
    </div>
  );
}

export default DataHubPanel;
