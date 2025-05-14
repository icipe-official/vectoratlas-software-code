import { IconButton, Checkbox, Typography, Grid, FormControlLabel } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { saveUserRoles } from '../../state/admin/actions/admin.actions';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { UsersWithRoles } from '../../state/state.types';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';

export const areRolesDifferent = (
  user: UsersWithRoles,
  workingCopy: UsersWithRoles
) => {
  return (
    user.is_admin !== workingCopy.is_admin ||
    user.is_uploader !== workingCopy.is_uploader ||
    user.is_reviewer !== workingCopy.is_reviewer ||
    user.is_editor !== workingCopy.is_editor ||
    user.is_model_manager !== workingCopy.is_model_manager ||
    user.is_reviewer_manager !== workingCopy.is_reviewer_manager ||
    user.disable_notifications !== workingCopy.disable_notifications
  );
};

export const UserControl = ({ user }: { user: UsersWithRoles }) => {
  const dispatch = useAppDispatch();
  const savingRoles = useAppSelector((s) => s.admin.savingUser);
  const [workingCopy, setWorkingCopy] = useState({ ...user });

  const onChange = (propName: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setWorkingCopy({
      ...workingCopy,
      [propName]: e.target.checked,
    });
  };

  const onSave = () => {
    dispatch(saveUserRoles(workingCopy));
  };

  const checkboxes = [
    { label: 'Uploader', key: 'is_uploader' },
    { label: 'Reviewer', key: 'is_reviewer' },
    { label: 'Editor', key: 'is_editor' },
    { label: 'Admin', key: 'is_admin' },
    { label: 'Review Manager', key: 'is_reviewer_manager' },
    { label: 'Model Manager', key: 'is_model_manager' },
    { label: 'Disable Notifications', key: 'disable_notification' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginBottom: '16px',
        padding: '8px 0',
        borderBottom: '1px solid #ccc',
      }}
    >
      <div style={{ marginBottom: '4px' }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {user.email}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          ({user.auth0_id})
        </Typography>
      </div>

      <Grid container spacing={1} alignItems="center">
        {checkboxes.map(({ label, key }) => (
          <Grid item xs={12} sm={6} md={1.4} key={key}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!workingCopy[key as keyof UsersWithRoles]}
                  onChange={onChange(key)}
                  size="small"
                />
              }
              label={<Typography variant="body2">{label}</Typography>}
            />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={2}>
        <Tooltip title="Save" arrow>
          <IconButton
            disabled={savingRoles || !areRolesDifferent(user, workingCopy)}
            onClick={onSave}
            size="small"
            style={{ color: 'darkgreen' }} // <-- Set icon color here
          >
            <SaveIcon fontSize="small" />
          </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
};
