import { Container } from '@mui/material';
import AboutHeader from '../src/components/about/aboutHeader';
import AboutTeam from '../src/components/about/aboutTeam';
import AboutContact from '../src/components/about/aboutContact';
import AboutPartner from '../src/components/about/aboutPartner';
import SectionPanel from '../src/components/layout/sectionPanel';

function About(): JSX.Element {
  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title="About">
            <AboutHeader />
          </SectionPanel>
          <SectionPanel title="The Team">
            <AboutTeam />
          </SectionPanel>
          <SectionPanel title="Contact Us">
            <AboutContact />
          </SectionPanel>
          <SectionPanel title="Our Partners">
            <AboutPartner />
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default About;
