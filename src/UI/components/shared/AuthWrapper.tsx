import { Box, Button, Typography } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../state/hooks';
import Link from 'next/link';

function AuthWrapper({
  role,
  children,
}: {
  role: string;
  children: JSX.Element;
}): JSX.Element {
  const { user, isLoading } = useUser();
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isLoadingRoles = useAppSelector((state) => state.auth.isLoading);

  const router = useRouter();
  const backHome = () => router.push('./');

  useEffect(() => {
    if (!user?.nickname && !isLoading) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoadingRoles) {
    return <></>;
  }

  if (!userRoles.includes(role)) {
    return (
      <Box data-testid="unauthorized" margin={5}>
        <Typography variant="h4">
          You are not currently {role === 'reviewer' ? 'a' : 'an'} {role}...
        </Typography>
        <Typography variant="body1" marginY={1}>
          If you wish to update your role, please contact us here: &nbsp;
          <Link href="mailto:vectoratlas@outlook.com" passHref>
            <a style={{ color: 'blue' }}>vectoratlas@outlook.com</a>
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
