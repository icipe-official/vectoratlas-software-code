import { IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { getUserRoles, saveUserRoles } from '../../state/admin/actions/admin.actions';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { UsersWithRoles } from '../../state/state.types';
import SaveIcon from '@mui/icons-material/Save';

const areRolesDifferent = (user: UsersWithRoles, workingCopy: UsersWithRoles) => {
  return user.is_admin !== workingCopy.is_admin ||
    user.is_uploader !== workingCopy.is_uploader ||
    user.is_reviewer !== workingCopy.is_reviewer ||
    user.is_editor !== workingCopy.is_editor;
}
export const UserControl = ({user}: {user: UsersWithRoles}) => {
  const dispatch = useAppDispatch();
  const savingRoles = useAppSelector((s) => s.admin.savingUser);

  const [workingCopy, setWorkingCopy] = useState({...user});

  const onChange = (propName: string) => (e) => {
    console.log(e.target.checked)
    setWorkingCopy({
      ...workingCopy,
      [propName]: e.target.checked
    })
  }

  const onSave = () => {
    console.log(workingCopy)
    dispatch(saveUserRoles(workingCopy))
  }

  return (
    <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
      <div style={{display: 'flex', flexGrow: 1}}>
        <Typography style={{fontWeight: 'bold', marginRight: '5px'}}>{user.email}</Typography>
        <Typography>({user.auth0_id})</Typography>
      </div>
      <Typography style={{}}>Uploader:</Typography><Checkbox checked={workingCopy.is_uploader} onChange={onChange("is_uploader")}/>
      <Typography style={{}}>Reviewer:</Typography><Checkbox checked={workingCopy.is_reviewer} onChange={onChange("is_reviewer")}/>
      <Typography style={{}}>Editor:</Typography><Checkbox checked={workingCopy.is_editor} onChange={onChange("is_editor")}/>
      <Typography style={{}}>Admin:</Typography><Checkbox checked={workingCopy.is_admin} onChange={onChange("is_admin")}/>
      <IconButton disabled={savingRoles || !areRolesDifferent(user, workingCopy)} onClick={onSave}>
        <SaveIcon />
      </IconButton>
    </div>
  )
}

export const UserRolePanel = () => {
  const dispatch = useAppDispatch();
  const loadingNews = useAppSelector((s) => s.admin.loading);

  const userRoles = useAppSelector((s) => s.admin.users); 

  useEffect(() => {
    dispatch(getUserRoles())
  }, [])

  return (
    <div>
      {loadingNews ? (
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
        {userRoles.map(u => {
          return (<UserControl key={u.auth0_id} user={u} />)
        })}
      </div>

    </div>
  )
}