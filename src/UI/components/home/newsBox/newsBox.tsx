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
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { loadTopNewsItems } from '../../../state/news/actions/news.action';
import { NewsItem } from '../../news/newsItem';
import Carousel from 'react-material-ui-carousel';

export const NewsBox = () => {
  const dispatch = useAppDispatch();
  const newsItems = useAppSelector((s) => s.news.topNews);
  const loadingNews = useAppSelector((s) => s.news.loading);

  const paper = {
    paddingBottom: 2,
    margin: 0,
    '&:hover': {
      boxShadow: 10,
    },
  };

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
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: 'gray',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: 'fit-content',
          }}
        >
          <NewspaperIcon
            sx={{ color: 'secondary.main', marginRight: 5, fontSize: '40px' }}
          />
          <Typography color="secondary" variant="h4">
            Latest News
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            style={{ width: '100%' }}
            variant="contained"
            onClick={handleMoreNewsClick}
            color="secondary"
          >
            More news...
          </Button>
        </div>
      </Box>
      <Box>
        <Carousel navButtonsAlwaysVisible autoPlay={false}>
          {newsItems.map((item, i) => (
            <NewsItem isEditor={false} key={i} item={item} />
          ))}
        </Carousel>
      </Box>
    </>
  );
};

export default NewsBox;
