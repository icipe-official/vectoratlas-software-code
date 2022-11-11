import { Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../state/hooks';

function AuthWrapper({role, children}: {role: string, children: JSX.Element }): JSX.Element {
  const { user, isLoading } = useUser();
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isLoadingRoles = useAppSelector((state) => state.auth.isLoading);

  const router = useRouter();
  const backHome = () => router.push('./');

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading])

  if (isLoadingRoles) {
    return (<></>);
  }

  if (!userRoles.includes(role)) {
    return (
      <div>
        <h1>You Are Not A(n) {role}</h1>
        <p>
          <a href="vectoratlas@outlook.com">
            For enquires send an email to:vectoratlas@outlook.com
          </a>
        </p>
        <Button variant="contained" onClick={backHome}>
          HOME
        </Button>
      </div>
    );
  }

  return children;
}

export default AuthWrapper;
