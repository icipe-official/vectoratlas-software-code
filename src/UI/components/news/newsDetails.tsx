import { Paper, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getNews } from '../../state/news/actions/news.action';
import { NewsItem } from './newsItem';

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
    <Paper sx={{ pl: 4, pr: 4, pt: 1, pb: 1 }}>
      <NewsItem item={newsItem} isEditor={isEditor} hideMoreDetailsButton />
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => <a style={{ color: 'blue' }} {...props} />,
        }}
      >
        {newsItem.article}
      </ReactMarkdown>
    </Paper>
  );
};

export default NewsDetails;
