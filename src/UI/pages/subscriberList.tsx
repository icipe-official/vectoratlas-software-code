import { Container } from '@mui/material';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';
import AuthWrapper from '../components/shared/AuthWrapper';
import { SubscriptionList } from '../components/subscription/manage_subsriptions';

const SubscriptionPage = (): JSX.Element => {
  return (
    <main>
      <Container
        maxWidth={false}
        sx={{
          padding: '20px',
          maxWidth: '75%',
          marginTop: '20px',
        }}
      >
        <AuthWrapper role="editor">
          <SubscriptionList />
        </AuthWrapper>
      </Container>
    </main>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default SubscriptionPage;
