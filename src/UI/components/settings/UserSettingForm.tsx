import { Avatar, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Grid, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { requestRoles } from '../../state/auth/actions/requestRoles';

function UserSettingForm() {
  const { user, isLoading } = useUser();
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isLoadingRoles = useAppSelector((state) => state.auth.isLoading);
  const isLoadingRequest = useAppSelector((state) => state.auth.roleRequestLoading);
  const dispatch = useAppDispatch();

  const roleList = ['admin', 'editor', 'reviewer', 'uploader'];

  const [roleRequestOpen, toggleRoleRequestOpen] = useState(false);
  const [rolesRequested, setRolesRequested] = useState<string[]>([]);
  const [requestReason, setRequestReason] = useState<string>('');
  const handleRoleCheck = (role: string) => {
    if (rolesRequested.length !== 0 && rolesRequested.includes(role)) {
      setRolesRequested(rolesRequested.filter(x => x !== role));
    } else {
      const newRoles = rolesRequested.concat(role)
      setRolesRequested(newRoles);
    }
  }

  const requestRolesSubmit = () => {
    const email = user!.email || 'Empty';
    dispatch(requestRoles({requestReason, rolesRequested, email}))
  }

  return (
    <Grid container spacing={3}>
      {isLoading || isLoadingRoles ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : null}
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <div>
              Welcome <b>{user?.nickname}</b>!
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} md={6}>
        <div>
          <h4 color="primary">Personal information</h4>
          <div style={{ marginTop: 30 }}>
            <TextField
              data-testid="namefield"
              id="outlined-basic"
              label="Name"
              variant="outlined"
              value={user?.name}
              fullWidth={true}
            />
          </div>
          <div style={{ marginTop: 30 }}>
            <TextField
              data-testid="emailfield"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={user?.email}
              fullWidth={true}
            />
          </div>
        </div>
      </Grid>
      <Grid item sm={12} md={6}>
        <div>
          <h4 color="primary">Access information</h4>
          <List data-testid="rolesList">
            {userRoles.map((role: any, index: any) => (
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
          {userRoles.length < roleList.length &&
            <Button data-testid="toggleRequest" onClick={() => toggleRoleRequestOpen(!roleRequestOpen)}>{roleRequestOpen ? "-" : "+"} Request additional roles</Button>
          }
          {roleRequestOpen &&
          <>
            <Typography>Role(s) requested:</Typography>
              {roleList.filter(x => !userRoles.includes(x)).map((role: any, index: any) => (
                <FormControlLabel key={index} control={
                  <Checkbox sx={{margin: 0}} checked={rolesRequested.includes(role)} onChange={() => handleRoleCheck(role)} />
                } label={role} />
              ))}
            <TextField
              data-testid="roleJustification"
              id="outlined-basic"
              label="Reason for request..."
              variant="outlined"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              fullWidth={true}
              sx={{marginTop:'5px'}}
            />
            <Button disabled={isLoadingRequest} data-testId="submitRequest" variant="contained" onClick={requestRolesSubmit} sx={{marginLeft: 0}}>Submit request</Button>
            {isLoadingRequest ? (
              <div
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <CircularProgress />
              </div>
              ) : null}
            </>
          }
        </div>
      </Grid>
    </Grid>
  );
}

export default UserSettingForm;
