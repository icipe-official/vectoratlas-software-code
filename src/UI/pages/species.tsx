import { useEffect } from 'react';
import { Container, useMediaQuery, useTheme } from '@mui/material';
import { AppDispatch } from '../state/store';
import { useDispatch } from 'react-redux';
import SectionPanel from '../components/layout/sectionPanel';
import SpeciesList from '../components/species/speciesList';
import { getAllSpecies } from '../state/speciesInformation/actions/getAllSpecies';

export default function SourcesPage(): JSX.Element {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllSpecies());
  }, [dispatch]);

  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: isMatch ? null : '75%',
          }}
        >
          <SectionPanel title="Species List">
            <SpeciesList />
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}
