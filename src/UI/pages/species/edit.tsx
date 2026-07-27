import { Container } from '@mui/material';
import React from 'react';
import AuthWrapper from '../../components/shared/AuthWrapper';
import SpeciesInformationEditor from '../../components/speciesInformation/speciesInformationEditor';
import { getMessages } from '../../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { RolesEnum } from '../../state/state.types';

const SpeciesInformationEditorPage = (): JSX.Element => {
  return (
    <>
      <div>
        <main>
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '75%',
            }}
          >
            <div>
              <AuthWrapper role={RolesEnum.EDITOR}>
                <SpeciesInformationEditor />
              </AuthWrapper>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default SpeciesInformationEditorPage;
