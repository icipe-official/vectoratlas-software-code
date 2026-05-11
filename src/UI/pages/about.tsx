import { Container } from '@mui/material';
import AboutHeader from '../components/about/aboutHeader';
import AboutTeam from '../components/about/aboutTeam';
import AboutContact from '../components/about/aboutContact';
import AboutPartner from '../components/about/aboutPartner';
import SectionPanel from '../components/layout/sectionPanel';
import { useMediaQuery, useTheme } from '@mui/material';
import AboutSidebar from '../components/about/aboutSidebar';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
function About(): JSX.Element {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

  const t = useTranslations('AboutPage');
  return (
    <div style={{flex: 1, overflowY: 'auto'}}>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: isMatch ? null : '75%',
          }}
        >
          <AboutSidebar />
          <SectionPanel title={t('sectionHeaders.about')}>
            <div id="About">
              <AboutHeader />
            </div>
          </SectionPanel>
          <SectionPanel title={t('sectionHeaders.team')}>
            <div id="The Team">
              <AboutTeam />
            </div>
          </SectionPanel>
          <SectionPanel title={t('sectionHeaders.contact')}>
            <div id="Contact Us">
              <AboutContact />
            </div>
          </SectionPanel>
          <SectionPanel title={t('sectionHeaders.partners')}>
            <div id="Our Partners">
              <AboutPartner />
            </div>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default About;
