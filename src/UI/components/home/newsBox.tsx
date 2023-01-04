import {
  Paper,
  Divider,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { loadTopNewsItems } from '../../state/news/actions/news.action';
import { NewsItem } from '../news/newsItem';

export const NewsBox = () => {
  const dispatch = useAppDispatch();
  const newsItems = useAppSelector((s) => s.news.topNews);
  const loadingNews = useAppSelector((s) => s.news.loading);

  useEffect(() => {
    dispatch(loadTopNewsItems());
  }, [dispatch]);

  const router = useRouter();

  const handleMoreNewsClick = () => {
    router.push('/news');
  };

  if (loadingNews) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Paper>
      <Typography color="primary" variant="h4" sx={{ p: 2, mt: 2, pb: 0 }}>
        News
      </Typography>
      <Box
        overflow="auto"
        flex={1}
        flexDirection="column"
        display="flex"
        flex-grow="1"
        p={2}
        pt={0}
      >
        {newsItems.map((n) => (
          <div key={n.title}>
            <NewsItem item={n} isEditor={false} />
            <Divider sx={{ pt: 1 }} />
          </div>
        ))}
      </Box>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          style={{ width: '80%', marginBottom: 20 }}
          variant="contained"
          onClick={handleMoreNewsClick}
        >
          More news...
        </Button>
      </div>
    </Paper>
  );
};

export default NewsBox;
