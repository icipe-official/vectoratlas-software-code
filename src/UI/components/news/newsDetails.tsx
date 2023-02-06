import { Button, Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getNews } from '../../state/news/actions/news.action';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const NewsDetails = () => {
  const dispatch = useAppDispatch();
  const newsItem = useAppSelector((s) => s.news.currentNewsForEditing);
  const loadingNews = useAppSelector((s) => s.news.loading);
  const isEditor = useAppSelector((state) =>
    state.auth.roles.includes('editor')
  );

  const router = useRouter();
  const id = router.query.id as string | undefined;

  useEffect(() => {
    if (id) {
      dispatch(getNews(id));
    }
  }, [id, dispatch]);

  if (loadingNews || !newsItem) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 1,
        paddingBottom: 10,
      }}
    >
      <div>
        <Button onClick={() => router.push('/news')}>
          <ArrowBackIcon />
          <Typography fontSize={'medium'}>Back to news list</Typography>
        </Button>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>
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
            {'## ' + newsItem.title}
          </ReactMarkdown>
        </div>
        {isEditor && (
          <Button
            variant="contained"
            style={{ whiteSpace: 'nowrap', height: '100%' }}
            onClick={() => router.push('/news/edit?id=' + newsItem.id)}
          >
            Edit item
          </Button>
        )}
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7} key="content">
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
            {newsItem.summary}
          </ReactMarkdown>
        </Grid>
        <Grid item xs={12} lg={5}>
          <picture>
            <img
              src={newsItem.image}
              style={{ width: '100%', paddingTop: '20px' }}
            />
          </picture>
        </Grid>
      </Grid>

      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => <a style={{ color: 'blue' }} {...props} />,
        }}
      >
        {newsItem.article}
      </ReactMarkdown>
    </div>
  );
};

export default NewsDetails;
