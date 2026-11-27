import React from 'react';
import { Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';
//import AuthWrapper from '../components/shared/AuthWrapper';
import CountryTable from '../components/country/country_table';

export default function CountryCataloguePage(): JSX.Element {
  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            // Phones: 20px on both sides to match the species page, 8px bottom. sm+: original 20px
            padding: { xs: '0 20px 8px', sm: '20px' },
            // Full width on phones/tablets, original 85% from md up
            maxWidth: { xs: '100%', md: '85%' },
            // No extra top margin on phones, original 20px from sm up
            marginTop: { xs: 0, sm: '20px' },
          }}
        >
          <CountryTable />
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}
