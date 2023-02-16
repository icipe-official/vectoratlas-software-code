import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { getUserRoles } from '../../state/admin/actions/admin.actions';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { UserControl } from './userControl';

export const UserRolePanel = () => {
  const dispatch = useAppDispatch();
  const loadingUserRoles = useAppSelector((s) => s.admin.loading);

  const userRoles = useAppSelector((s) => s.admin.users);

  useEffect(() => {
    dispatch(getUserRoles());
  }, [dispatch]);

  return (
    <div>
      {loadingUserRoles ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : null}
      <Typography
        color="primary"
        variant="h5"
        sx={{ mt: 2, mb: 1 }}
        style={{ flexGrow: 1 }}
      >
        User Roles
      </Typography>
      <div>
        {userRoles.map((u) => {
          return <UserControl key={u.auth0_id} user={u} />;
        })}
      </div>
    </div>
  );
};
