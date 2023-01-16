import { Avatar, Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import { useUser } from '@auth0/nextjs-auth0';
import { useAppSelector } from '../state/hooks';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Grid, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import UserSettingForm from '../components/settings/UserSettingForm';
import AuthWrapper from '../components/shared/AuthWrapper';

function UserSettings() {
  const { user, isLoading } = useUser();
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isLoadingRoles = useAppSelector((state) => state.auth.isLoading);

  const router = useRouter();
  const backHome = () => router.push('./');

  useEffect(() => {
    if (!user) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title="User settings">
            <AuthWrapper role="">
              <UserSettingForm />
            </AuthWrapper>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default UserSettings;
