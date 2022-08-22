import { Container } from '@mui/material';
import AboutHeader from '../components/about/aboutHeader';
import AboutTeam from '../components/about/aboutTeam';
import AboutContact from '../components/about/aboutContact';
import AboutPartner from '../components/about/aboutPartner';
import SectionPanel from '../components/layout/sectionPanel';

function About(): JSX.Element {
  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}>
          <AboutHeader />
          <AboutTeam />
          <AboutContact />
          <AboutPartner />
        </Container>
      </main>
    </div>
  );
}

export default About;
