import React from 'react'
import NotUploader from '../components/shared/Notauthenticated';
import Upform from '../components/upload/Upform'
import { useAppSelector } from '../state/hooks';


function upload()  {
  const role = useAppSelector((state) => state.auth.roles);
  
  if (role.includes('uploader')){
  return (
    <div>
      
        <Upform/>
    </div>
  )
  }
  return(
    <div>
      <h1>{role}</h1>
      <NotUploader name = 'uploader'/>
    </div>
  )
}

export default upload