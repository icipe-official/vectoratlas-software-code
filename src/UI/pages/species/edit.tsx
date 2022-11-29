import { Container } from '@mui/material';
import React from 'react';
import AuthWrapper from '../../components/shared/AuthWrapper';
import SpeciesInformationEditor from '../../components/speciesInformation/speciesInformationEditor';

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
              <AuthWrapper role="editor">
                <SpeciesInformationEditor />
              </AuthWrapper>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
};

export default SpeciesInformationEditorPage;
