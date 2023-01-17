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
import NewspaperIcon from '@mui/icons-material/Newspaper';

export const NewsBox = () => {
  const dispatch = useAppDispatch();
  const newsItems = useAppSelector((s) => s.news.topNews);
  const loadingNews = useAppSelector((s) => s.news.loading);

  const paper = {
    paddingBottom: 2,
    '&:hover': {
      boxShadow: 10
    },
  }

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
    <Paper sx={paper}>
      <Box sx={{display:'flex', width: '100%', justifyContent: 'space-between', p:2, backgroundColor: 'gray',borderTopLeftRadius:'5px', borderTopRightRadius: '5px'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent: 'space-around', width: 'fit-content'}}>
          <NewspaperIcon fontSize='large' sx={{color:'secondary.main', marginRight: 5}}/>
          <Typography color="secondary" variant="h4">
            News Feed
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '20%' }}>
          <Button
            style={{ width: '100%' }}
            variant="contained"
            onClick={handleMoreNewsClick}
            color='secondary'
          >
            More news...
          </Button>
        </div>
      </Box>
      <Box
        overflow="auto"
        flex={1}
        flexDirection="row"
        flexWrap={'wrap'}
        display="flex"
        flex-grow="1"
        p={2}
        pt={0}
      >
        {newsItems.map((n) => (
          <div key={n.title}>
            <NewsItem item={n} isEditor={false} />
            <Divider color='primary' sx={{ mt: 1, borderRadius: 5, opacity:1 }} />
          </div>
        ))}
      </Box>
    </Paper>
  );
};

export default NewsBox;
