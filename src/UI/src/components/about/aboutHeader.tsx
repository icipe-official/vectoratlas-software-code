import { Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function AboutHeader() {
  return (
    <Box>
      <Typography variant="body1" sx={{ paddingBottom: 3 }}>
        Maps are a powerful tool. They can illustrate the distribution of
        mosquito vector species known to transmit some of the world&apos;s most
        debilitating diseases and highlight where these species are no longer
        susceptible to the insecticides used as their primary method of control.
        All evidence-based maps rely on field data collected in a myriad of
        different ways by multiple data collectors for a wide variety of
        purposes. In isolation, these data are able to answer the questions they
        were collected to address, but when combined, their value multiplies.
        The Vector Atlas is building a data-hub that links &apos;core&apos;
        African vector occurrence, bionomics and insecticide resistance data to
        provide a &apos;one stop shop&apos; of relatable and cross-referenced
        data access. Using our standardised and comprehensive collation
        protocols (Hay et al 2010) to abstract data from the published and grey
        literature (maintaining all data ownership), we are updating our core
        datasets (Sinka et al (2010), Massey et al (2016), Moyes et al (2020))
        which will expand beyond the dominant vector species to cover the
        prominent secondary vector species responsible for residual
        transmission. We are adding locally relevant human community behaviour,
        local flora (nectar sources) and fauna (livestock). Combined, these data
        will inform novel spatial models and maps that promote and evolve our
        understanding of the variables that drive malaria transmission.
      </Typography>
      <Typography variant="body1" sx={{ paddingBottom: 3 }}>
        The initial development phase of the Vector Atlas will run over three
        years culminating in an open access platform allowing data upload and
        download, alongside our spatial models and maps. We will work closely
        with vector control agencies on the ground to provide sub-national,
        bespoke spatial analyses to directly address their specific challenges
        in vector control.
      </Typography>
      <Typography variant="body1" sx={{ paddingBottom: 3 }}>
        The Vector Atlas is a University of Oxford, International Centre of
        Insect Physiology and Ecology (icipe) and Malaria Atlas Project
        initiative, funded by the Bill and Melinda Gates Foundation and working
        in collaboration with GBIF, IR Mapper, PAMCA, VectorBase, Global Vector
        Hub, Amplicon Project, MalariaGen, Target Malaria…
      </Typography>
      <Typography variant="body1" sx={{ paddingBottom: 3, fontWeight: 'bold' }}>
        We are currently collecting feedback from vector data producers and
        users to help us make sure the vector atlas provides maximum use. If you
        are interested in providing us with feedback, please complete our online
        questionnaire:{' '}
        <Link href="https://forms.gle/yQeZezGfhdTZXUm4A" passHref>
          <a style={{ color: 'blue' }}>{'HERE'}</a>
        </Link>
        . Alternatively please contact us directly:{' '}
        <Link href="#" passHref>
          <a style={{ color: 'blue' }}>{'vectoratlas@outlook.com'}</a>
        </Link>
      </Typography>
    </Box>
  );
}
