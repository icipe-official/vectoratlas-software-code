import { Container } from '@mui/material';
import React from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import UserSettingForm from '../components/settings/UserSettingForm';
import AuthWrapper from '../components/shared/AuthWrapper';

function UserSettings() {
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
