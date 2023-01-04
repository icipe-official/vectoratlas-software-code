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

  return (
    <div>
      <div style={{ display: 'flex' }}>
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
            {item.summary}
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
              src={item.image}
              style={{ width: '100%', paddingLeft: '15px' }}
              alt="placeholder"
            />
          </picture>
        </Grid>
      </Grid>
      {!hideMoreDetailsButton ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleMoreDetailsClick}>
            More details...
          </Button>
        </div>
      ) : null}
    </div>
  );
};
