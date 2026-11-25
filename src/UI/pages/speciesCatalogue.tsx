import { Container } from '@mui/material';
import React from 'react';
import { getMessages } from '../utils/localization';
import CatalogueTable from '../components/species/catalogueTable';
import { GetServerSidePropsContext } from 'next';

const cataloguePage = (): JSX.Element => {
  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            // Phones: no top padding, 8px sides/bottom. sm+: original 20px
            padding: { xs: '0 8px 8px', sm: '20px' },
            // Full width on phones/tablets, original 85% from md up
            maxWidth: { xs: '100%', md: '85%' },
            // No extra top margin on phones, original 20px from sm up
            marginTop: { xs: 0, sm: '20px' },
          }}
        >
          <CatalogueTable />
        </Container>
      </main>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default cataloguePage;
