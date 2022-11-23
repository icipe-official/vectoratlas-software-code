import { Paper, Divider, Box, Grid } from '@mui/material';
import ReactMarkdown from 'react-markdown';

export type NewsItemType = {
  title: string;
  description: string;
  imgSrc: string;
};

const newsItems: NewsItemType[] = [
  {
    title: '8th Annual PAMCA conference in Kigali!',
    description:
      'The Vector Atlas team had a great time at the 8th Annual PAMCA conference ' +
      'in Kigali! Excellent sessions, field trip and social events, and we particularly enjoyed' +
      " the opportunity to meet with many of our colleagues who we've missed seeing in person " +
      'over the past few COVID years.\n\nThank you to the PAMCA organisers for a fantastic ' +
      'conference and we look forward to next year.',
    imgSrc: '/PAMCAiPicture.jpg',
  },
  {
    title: 'We will be presenting the Vector Atlas at PAMCA!',
    description:
      'We will be attending the 8th PAMCA Annual Conference from 26-28 September 2022 and are excited to attending the sessions and events and hear about the ongoing work in vector research and control. We also look forward to connecting with current and new collaborators at this event.\n\nPlease join us for our presentation on **Tuesday 27 September at 10:30 in Parallel Session 8, room AD12** where we will showcase **The Vector Atlas**. Hope to see you there!',
    imgSrc: '/partners/pamca_logo.png',
  },
  {
    title:
      'We would like to hear from you - please complete our online [questionnaire!](https://forms.gle/yQeZezGfhdTZXUm4A)',
    description:
      'The Vector Atlas aims to produce data, modelling and mapping outputs that are fit for purpose and tailored to address practical issues in vector control.\n\nWe are therefore collecting feedback from vector data producers and users to help us make sure the Vector Atlas provides maximum use. If you are interested in providing feedback, please complete our online questionnaire **[here](https://forms.gle/yQeZezGfhdTZXUm4A)**',
    imgSrc: '/feedback.jpg',
  },
  {
    title: 'Vector Atlas Launch Meeting – 4th to 8th July 2022',
    description:
      'Our international Vector Atlas team gathered at icipe’s Duduville campus in Nairobi to celebrate the launch of our project, bringing together data and geospatial experts, spatial modellers and developers to build our Atlas.\n\nThe launch event was a great success, allowing many of us to meet face to face for the first time. Over three upbeat and fun days, we confirmed the solid foundations of the project and mapped out our future timetable. We also enjoyed a most magnificent meal at the Safari Hotel, Nairobi!',
    imgSrc: '/kick-off-meeting.jpg',
  },
];

const NewsItem = ({ item }: { item: NewsItemType }) => {
  return (
    <div>
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => <a style={{ color: 'blue' }} {...props} />,
        }}
      >
        {'## ' + item.title}
      </ReactMarkdown>
      <Grid
        container
        display="flex"
        width={'100%'}
        justifyContent="center"
        pb={2}
        mt={-2}
      >
        <Grid item md={8}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a style={{ color: 'blue' }} {...props} />
              ),
            }}
          >
            {item.description}
          </ReactMarkdown>
        </Grid>
        <Grid
          item
          md={4}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <picture>
            <img
              src={item.imgSrc}
              style={{ width: '100%', paddingLeft: '15px' }}
              alt="placeholder"
            />
          </picture>
        </Grid>
      </Grid>
      <Divider flexItem />
    </div>
  );
};

export const NewsBox = () => {
  return (
    <Paper>
      <Box
        overflow="auto"
        flex={1}
        flexDirection="column"
        display="flex"
        flex-grow="1"
        p={2}
      >
        {newsItems.map((n) => (
          <NewsItem key={n.title} item={n} />
        ))}
      </Box>
    </Paper>
  );
};

export default NewsBox;
