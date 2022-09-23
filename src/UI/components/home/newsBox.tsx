import { Paper, Typography, Divider, Box } from '@mui/material';
import Link from 'next/link';

export default function NewsBox() {
  return (
    <Paper>
      <Box overflow="auto" flex={1} flexDirection="column" display="flex" flex-grow="1" p={2} maxHeight='50vh' >
        <Typography variant="h5" pb={1}>
          We will be presenting the Vector Atlas at PAMCA!
        </Typography>
        <Box display="flex" pb={2}>
          <Typography variant="body1" >
          We will be attending the 8th PAMCA Annual Conference from 26-28 September 2022 and are excited to attending the sessions and events and hear about the ongoing work in vector research and control. We also look forward to connecting with current and new collaborators at this event.
            <br />
            <br />
          Please join us for our presentation on <strong>28 September (Day 3) in Session 11</strong> where we will showcase <strong>The Vector Atlas</strong>. Hope to see you there!

          </Typography>
          <picture>
            <img src='/partners/pamca_logo.png' style={{maxHeight: '150px', paddingTop: '5px'}} alt="placeholder"/>
          </picture>
        </Box>
        <Divider flexItem />
        <Typography variant="h5" mt={3} pb={1}>
          We would like to hear from you - please complete our online{' '}<Link href='https://forms.gle/yQeZezGfhdTZXUm4A' passHref>
            <a style={{ color: 'blue' }}>{'questionnaire!'}</a>
          </Link>
        </Typography>
        <Box display="flex" pb={2}>
          <Typography variant="body1" >
          The Vector Atlas aims to produce data, modelling and mapping outputs that are fit for purpose and tailored to address practical issues in vector control.  
            <br />
            <br />
          We are therefore collecting feedback from vector data producers and users to help us make sure the Vector Atlas provides maximum use.  If you are interested in providing feedback, please complete our online questionnaire <Link href='https://forms.gle/yQeZezGfhdTZXUm4A' passHref>
              <a style={{ color: 'blue' }}>{'here'}</a>
            </Link>. 

          </Typography>
          <picture>
            <img src='feedback.jpg' style={{maxHeight: '150px', paddingTop: '5px'}} alt="placeholder"/>
          </picture>
        </Box>
        <Divider flexItem />
        <Typography variant="h5"  mt={3} pb={1}>
          Vector Atlas Launch Meeting – 4th to 8th July 2022
        </Typography>
        <Box display="flex" pb={2}>
          <Typography variant="body1" >
            Our international Vector Atlas team gathered at icipe’s Duduville campus in Nairobi to celebrate the launch of our project, bringing together data and geospatial experts, spatial modellers and developers to build our Atlas. 
            <br />
            <br />
            The launch event was a great success, allowing many of us to meet face to face for the first time.  Over three upbeat and fun days, we confirmed the solid foundations of the project and mapped out our future timetable. We also enjoyed a most magnificent meal at the Safari Hotel, Nairobi!
          </Typography>
          <picture>
            <img src='kick-off-meeting.jpg' style={{maxHeight: '200px', paddingTop: '15px', paddingLeft: '5px'}} alt="placeholder"/>
          </picture>
        </Box>
      </Box>
    </Paper>
  );
}
