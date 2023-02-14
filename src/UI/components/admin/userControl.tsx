import { IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import {
  saveUserRoles,
} from '../../state/admin/actions/admin.actions';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { UsersWithRoles } from '../../state/state.types';
import SaveIcon from '@mui/icons-material/Save';

export const areRolesDifferent = (
  user: UsersWithRoles,
  workingCopy: UsersWithRoles
) => {
  return (
    user.is_admin !== workingCopy.is_admin ||
    user.is_uploader !== workingCopy.is_uploader ||
    user.is_reviewer !== workingCopy.is_reviewer ||
    user.is_editor !== workingCopy.is_editor
  );
};

export const UserControl = ({ user }: { user: UsersWithRoles }) => {
  const dispatch = useAppDispatch();
  const savingRoles = useAppSelector((s) => s.admin.savingUser);

  const [workingCopy, setWorkingCopy] = useState({ ...user });

  const onChange = (propName: string) => (e) => {
    setWorkingCopy({
      ...workingCopy,
      [propName]: e.target.checked,
    });
  };

  const onSave = () => {
    dispatch(saveUserRoles(workingCopy));
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <div style={{ flexGrow: 1, alignItems: 'center' }}>
        <Typography style={{ fontWeight: 'bold', marginRight: '5px' }}>
          {user.email}
        </Typography>
        <Typography variant="caption">({user.auth0_id})</Typography>
      </div>
      <Typography style={{}}>Uploader:</Typography>
      <Checkbox
        checked={workingCopy.is_uploader}
        onChange={onChange('is_uploader')}
      />
      <Typography style={{}}>Reviewer:</Typography>
      <Checkbox
        checked={workingCopy.is_reviewer}
        onChange={onChange('is_reviewer')}
      />
      <Typography style={{}}>Editor:</Typography>
      <Checkbox
        checked={workingCopy.is_editor}
        onChange={onChange('is_editor')}
      />
      <Typography style={{}}>Admin:</Typography>
      <Checkbox
        checked={workingCopy.is_admin}
        onChange={onChange('is_admin')}
      />
      <IconButton
        disabled={savingRoles || !areRolesDifferent(user, workingCopy)}
        onClick={onSave}
      >
        <SaveIcon />
      </IconButton>
    </div>
  );
};