import { Container } from '@mui/material';
import AboutHeader from '../components/about/aboutHeader';
import AboutTeam from '../components/about/aboutTeam';
import AboutContact from '../components/about/aboutContact';
import AboutPartner from '../components/about/aboutPartner';
import SectionPanel from '../components/layout/sectionPanel';
import { useMediaQuery, useTheme } from '@mui/material';
import AboutSidebar from '../components/about/aboutSidebar';
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
          }}
        >
          <AboutSidebar />
          <SectionPanel title="About">
            <div id="About">
              <AboutHeader />
            </div>
          </SectionPanel>
          <SectionPanel title="The Team">
            <div id="The Team">
              <AboutTeam />
            </div>
          </SectionPanel>
          <SectionPanel title="Contact Us">
            <div id="Contact Us">
              <AboutContact />
            </div>
          </SectionPanel>
          <SectionPanel title="Our Partners">
            <div id="Our Patners">
              <AboutPartner />
            </div>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default About;
