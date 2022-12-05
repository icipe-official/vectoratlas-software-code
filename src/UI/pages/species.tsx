import { useEffect } from 'react';
import { Container, useMediaQuery, useTheme } from '@mui/material';
import { AppDispatch } from '../state/store';
import { useDispatch } from 'react-redux';
import SectionPanel from '../components/layout/sectionPanel';
import dynamic from 'next/dynamic';
import { getAllSpecies } from '../state/speciesInformation/actions/upsertSpeciesInfo.action';

const SpeciesListNoSsr = dynamic(
  () => import('../components/species/speciesList'),
  { ssr: false }
);

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
            <SpeciesListNoSsr />
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}
