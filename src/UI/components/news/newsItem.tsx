import React from 'react';
import { News } from '../../state/state.types';
import { Button, Grid, IconButton } from '@mui/material';
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

  const newsItem = {
    mt:2,
    padding: '8px',
    borderRadius:'5px',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(0,0,0,0.05)'
    },
  };

  return (
    <Grid container sx={newsItem} onClick={handleMoreDetailsClick}>
      <Grid item md={9}>
        <div style={{ display: 'flex'}}>
          <div style={{ flexGrow: 1 }}>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a style={{ color: 'blue' }} {...props} />
                ),
              }}
            >
              {'## ' + item.title}
            </ReactMarkdown>
          </div>
          {isEditor ? (
            <IconButton
              style={{ height: 40, width: 40, marginRight: -10, marginTop: 10 }}
              onClick={handleEditClick}
            >
              <EditIcon />
            </IconButton>
          ) : null}
        </div>
        <Grid item md={12}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a style={{ color: 'blue' }} {...props} />
              ),
            }}
          >
            {item.summary}
          </ReactMarkdown>
        </Grid>
      </Grid>
      <Grid
          item
          md={3}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
      >
        <picture style={{height:'200px'}}>
          <img
            src={item.image}
            style={{ borderRadius: '5px', margin: 10, height:'100%'}}
            alt="placeholder"
          />
        </picture>
      </Grid>
      {!hideMoreDetailsButton ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleMoreDetailsClick}>
            More details...
          </Button>
        </div>
      ) : null}
    </Grid>
  );
};
