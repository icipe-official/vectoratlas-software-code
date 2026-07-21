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
            padding: '20px',
            maxWidth: '85%',
            marginTop: '20px'
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