import { Button, Paper, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getAllNewsItems } from '../../state/news/actions/news.action';
import { NewsItem } from './newsItem';

import router from 'next/router';
import { clearCurrentNewsItem } from '../../state/news/newsSlice';

export const NewsList = () => {
  const dispatch = useAppDispatch();
  
  const newsItems = useAppSelector((s) => s.news.news);
  const loadingNews = useAppSelector((s) => s.news.loading);
  const isEditor = useAppSelector((state) =>
    state.auth.roles.includes('editor')
  );

  useEffect(() => {
    dispatch(getAllNewsItems());
  }, [dispatch]);

  if (loadingNews) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  const createNewArticle = () => {
    dispatch(clearCurrentNewsItem())
    router.push('/news/edit');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          color="primary"
          variant="h4"
          sx={{ mt: 2, mb: 1 }}
          style={{ flexGrow: 1 }}
        >
          News
        </Typography>
        {isEditor ? (
          <Button
            variant="contained"
            style={{ height: '50%' }}
            onClick={createNewArticle}
          >
            Create new article
          </Button>
        ) : null}
      </div>

      {newsItems.map((n) => (
        <div
          key={n.id}
          style={{
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 1,
            paddingBottom: 10,
          }}
        >
          <NewsItem isEditor={isEditor} item={n} />
        </div>
      ))}
    </div>
  );
};

export default NewsList;
