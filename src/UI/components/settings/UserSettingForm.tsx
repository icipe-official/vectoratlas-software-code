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

function UserSettingForm(props) {
  return (
    <div>
      <main>
        <Container>
          <SectionPanel title="User's Settings">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <div>
                      Welcome <b>{props.user?.nickname}</b>!
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={6}>
                <div>
                  <h4 color="primary">Personal information</h4>
                  <div style={{ marginTop: 30 }}>
                    <TextField
                      id="outlined-basic"
                      label="Name"
                      variant="outline"
                      value={props.user?.name}
                      fullWidth={true}
                    />
                  </div>
                  <div style={{ marginTop: 30 }}>
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      value={props.user?.email}
                      fullWidth={true}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item sm={12} md={6}>
                <div>
                  <h4 color="primary">Access information</h4>
                  <div>
                    <List>
                      {props.userRoles.map((role, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar>
                              <LockOpenIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={role} />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </Grid>
            </Grid>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default UserSettingForm;
