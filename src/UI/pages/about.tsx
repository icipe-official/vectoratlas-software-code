import { Container } from '@mui/material';
import AboutHeader from '../components/about/aboutHeader';
import AboutTeam from '../components/about/aboutTeam';
import AboutContact from '../components/about/aboutContact';
import AboutPartner from '../components/about/aboutPartner';
import SectionPanel from '../components/layout/sectionPanel';
import { useMediaQuery, useTheme } from '@mui/material';

function About(): JSX.Element {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: isMatch ? null : '75%',
            margin: 0,
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
