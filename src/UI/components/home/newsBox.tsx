import { Paper, Divider, Box, Grid } from '@mui/material';
import ReactMarkdown from 'react-markdown';

export type NewsItemType = {
  title: string;
  description: string;
  imgSrc: string;
};

const newsItems: NewsItemType[] = [
  {
    title: 'Special Distribution Modelling training course',
    description:
      '30 November - 2 December 2022\n\n' +
      'Lead by members of the Vector Atlas (VA) team, Prof. Nick Golding and Dr Gerry Ryan from TelethonKids, Australia, and hosted by VA partner, the International Centre of Insect Physiology and Ecology (icipe) in Nairobi, we have just completed our first VA training course on Species Distribution Modelling.\n\n' +
      'We welcomed twenty researchers from icipe, the African Conservation Centre in Kenya, the Ifakara Health Institute in Tanzania, and the Nigerian Institute of Medical Research. The course focused on developing participants’ ability to use advanced methods for modelling the spatial distribution of mosquito species from biased species occurrence data. Although our focus remains on the mosquito vectors of malaria, we hope the skills developed on the course find a wider application, with implications for conservation and improving the knowledge base of those using evidence-based maps in their research.',
    imgSrc: '/Vector_Atlas training-1.jpg',
  },
  {
    title: 'Forthcoming training and stakeholder events ',
    description:
      'The Vector Atlas team are excited to be hosting two key events in Kenya later this year:\n' +
      '1. A training course on Species Distribution Modelling for early career researchers from icipe and invited guests from Kenya, Tanzania, and Nigeria (30 November - 2 December2022). This course will focus on methods to advance the modelling of mosquito species’ spatial distributions from biased species occurrence data, with direct relevance to informing vector control strategies.\n\n' +
      '1. An Engagement and Partnership Meeting to be held at icipe’s research campus in Mbita from 5 - 9 December. Within-country vector control stakeholders and experts from across Africa will describe the challenges they face implementing malaria vector control at a sub-national level. Their experiences plus a forum of discussion and feedback throughout the meeting will form the blueprint for the Vector Atlas to provide products and spatial models of maximum value for evidence-based decision making.',
    imgSrc: '/Mbita.jpg',
  },
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
