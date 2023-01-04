import { Paper, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getAllNewsItems } from '../../state/news/actions/news.action';
import { NewsItem } from './newsItem';

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

  return (
    <div>
      <Typography color="primary" variant="h4" sx={{ mt: 2, mb: 1 }}>
        News
      </Typography>
      {newsItems.map((n) => (
        <Paper key={n.id} sx={{ pl: 4, pr: 4, pt: 1, pb: 1 }}>
          <NewsItem isEditor={isEditor} item={n} />
        </Paper>
      ))}
    </div>
  );
};

export default NewsList;
