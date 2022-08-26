import { Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function AboutHeader() {
  return (
    <Box>
      <Typography variant='body1' textAlign='center'>
        Maps are a powerful tool. They can illustrate the distribution of mosquito vector species known to transmit some of the world's most 
        debilitating diseases and highlight where these species are no longer susceptible to the insecticides used as their primary method of control. 
        All evidence-based maps rely on field data collected in a myriad of different ways by multiple data collectors for a wide variety of purposes. In 
        isolation, these data are able to answer the questions they were collected to address, but when combined, their value multiplies. The Vector Atlas is 
        building a data-hub that links 'core' African vector occurrence, bionomics and insecticide resistance data to provide a  'one stop shop' of relatable 
        and cross-referenced data access. Using our standardised and comprehensive collation protocols (Hay et al 2010) to abstract data from the published and 
        grey literature (maintaining all data ownership), we are updating our core datasets (Sinka et al (2010), Massey et al (2016), Moyes et al (2020)) which 
        will expand beyond the dominant vector species to cover the prominent secondary vector species responsible for residual transmission. We are adding 
        locally relevant human community behaviour, local flora (nectar sources) and fauna (livestock). Combined, these data will inform novel spatial models 
        and maps that promote and evolve our understanding of the variables that drive malaria transmission. 
        <br></br>
        <br></br>
        The initial development phase of the Vector Atlas will run over three years culminating in an open access platform allowing data upload and download, alongside 
        our spatial models and maps. We will work closely with vector control agencies on the ground to provide sub-national, bespoke spatial analyses to directly address 
        their specific challenges in vector control.
        <br></br>
        <br></br>
        The Vector Atlas is a University of Oxford and International Centre of Insect Physiology and Ecology (ICIPE) initiative, funded by the Bill and Melinda Gates 
        Foundation and working in collaboration with GBIF, IR Mapper, PAMCA, VectorBase, Global Vector Hub, Amplicon Project, MalariaGen, Target Malaria… 
        <br></br>
        <br></br>
        WE ARE CURRENTLY COLLECTING FEEDBACK FROM VECTOR DATA PRODUCERS AND USERS TO HELP US MAKE SURE THE VECTOR ATLAS PROVIDES MAXIMUM USE. IF YOU ARE INTERESTED IN 
        PROVIDING US WITH FEEDBACK, PLEASE COMPLETE OUR ONLINE QUESTIONNAIRE:{' '}
        <Link href='#' passHref>
          <a style={{ color: 'blue' }}>{'HERE'}</a>
        </Link>.
        Alternatively please contact us directly:{' '}
        <Link href='#' passHref>
          <a style={{ color: 'blue' }}>{'vectoratlas@outlook.com'}</a>
        </Link>
        
      </Typography>
    </Box>
  );
}
