import { Button } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/router';

interface authrole{
  name: string
}

function Notauthenticated ({name}:authrole)  {
    const router = useRouter();
    const backHome =  () => router.push('./')
  return (
    <div>
        <h1>You Are Not An {name}</h1>
        <p><a href="vectoratlas@outlook.com">visit this link to request permision</a></p>
        <Button variant="contained" onClick={backHome}>HOME</Button>
    </div>
  )
}

export default Notauthenticated