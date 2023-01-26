import React from 'react';
import { News } from '../../state/state.types';
import { Button, CardContent, CardMedia, Grid, IconButton, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';

export const NewsItem = ({
  item,
  isEditor,
  hideMoreDetailsButton,
}: {
  item: News;
  isEditor: boolean;
  hideMoreDetailsButton?: boolean;
}) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push('/news/edit?id=' + item.id);
  };

  const handleMoreDetailsClick = () => {
    router.push('/news/article?id=' + item.id);
  };

  return (
    <Paper sx={{margin: 0, marginLeft: '2px'}}>
    <Grid container spacing={0} sx={{justifyContent: 'center'}} className="BannerGrid">
        <Grid item xs={12} md={9} key="content">
            <CardContent className="Content">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a style={{ color: 'blue' }} {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 style={{ margin: 0 }} {...props} />
                  ),
                }}
              >
                {'## ' + item.title}
              </ReactMarkdown>

              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a style={{ color: 'blue' }} {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      style={{
                        marginTop: 15,
                        marginBottom: 0,
                        textAlign: 'justify',
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {item.summary}
              </ReactMarkdown>
            </CardContent>
            <Grid sx={{justifyContent: 'end', width: '100%', display: 'flex'}}>
              {!hideMoreDetailsButton &&
                <Button variant="outlined"
                onClick={handleMoreDetailsClick} className="ViewButton">
                  More details...
                </Button>
              }
              {!isEditor &&
                <Button variant="contained"
                onClick={handleEditClick} className="EditButton">
                Edit item
                </Button>
              }
            </Grid>

        </Grid>
        <Grid item xs={12} md={3} key={item.title} sx={{height: '50vh', maxHeight: '40vh'}}>
          <CardMedia
                    className="Media"
                    image={item.image}
                    sx={{height: '100%', overflow: 'hidden'}}
                >
                </CardMedia>
        </Grid>
    </Grid></Paper>
  );
};
