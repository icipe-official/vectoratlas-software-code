import { Container } from '@mui/material';
import SectionPanel from '../components/layout/sectionPanel';
import { useMediaQuery, useTheme } from '@mui/material';
import SpeciesList from '../components/species/speciesList';

function Species(): JSX.Element {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
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

export default Species;
