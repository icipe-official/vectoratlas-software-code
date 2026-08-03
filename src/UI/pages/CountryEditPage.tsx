import React from 'react';
import { Container, Box } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';
import AuthWrapper from '../components/shared/AuthWrapper';
import CountryEdit from '../components/country/CountryEdit';

export default function CountryEditPageRoute(): JSX.Element {
  return (
    <div>
      <main>
        <Container>
          {/*<AuthWrapper role="editor">*/}
          <Box sx={{ mt: 4, mb: 6 }}>
            <CountryEdit />
          </Box>
          {/*</AuthWrapper>*/}
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
