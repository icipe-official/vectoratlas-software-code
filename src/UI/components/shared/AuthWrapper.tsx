import { Box, Button, Typography } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../state/hooks';
import Link from 'next/link';
import { RolesEnum } from '../../state/state.types';

function AuthWrapper({
  role,
  children,
}: {
  role: string | string[];
  children: JSX.Element;
}): JSX.Element {
  const { user, isLoading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isLoadingRoles = useAppSelector((state) => state.auth.isLoading);
  const router = useRouter();
  const backHome = () => router.push('./');

  useEffect(() => {
    if (!user?.nickname && !isLoading) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!role || role === '' || role.length === 0) {
      setIsAuthorized(true);
    } else {
      if (typeof role === 'string') {
        setIsAuthorized(userRoles.includes(role));
      } else {
        let res = userRoles.some((val) => role.includes(val.toString()));
        setIsAuthorized(res);
      }
    }
  }, [role, userRoles]);

  if (isLoadingRoles) {
    return <></>;
  }

  // if (role !== '' && !userRoles.includes(role)) {
  if (!isAuthorized) {
    return (
      <Box data-testid="unauthorized" margin={5}>
        <Typography variant="h4">
          You are not currently {role === RolesEnum.REVIEWER ? 'a' : 'an'}{' '}
          {typeof role === 'string' ? role : role[0]}.
        </Typography>
        <Typography variant="body1" marginY={1}>
          If you wish to update your role, please use the &apos;Request
          additional roles&apos; section of the &nbsp;
          <Link href="/user_settings" passHref>
            <a style={{ color: 'blue' }}>User Settings Page</a>
          </Link>
        </Typography>
        <Button variant="contained" onClick={backHome}>
          HOME
        </Button>
      </Box>
    );
  }

  return children;
}

export default AuthWrapper;
