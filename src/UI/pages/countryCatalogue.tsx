import React from 'react';
import { Container, Box } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';
import AuthWrapper from '../components/shared/AuthWrapper';
import CountryTable from '../components/country/country_table';

export default function CountryCataloguePage(): JSX.Element {
  return (
    <div>
      <main>
        <Container>
          <AuthWrapper role="editor">
            <Box sx={{ mt: 4, mb: 6 }}>
              <CountryTable />
            </Box>
          </AuthWrapper>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
