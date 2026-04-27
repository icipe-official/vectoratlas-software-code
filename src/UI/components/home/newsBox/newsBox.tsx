import {
  Paper,
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
import { useTranslations } from 'next-intl';

export const NewsBox = () => {
  const t = useTranslations('NewsBox');
  const dispatch = useAppDispatch();
  const newsItems = useAppSelector((s) => s.news.topNews);
  const loadingNews = useAppSelector((s) => s.news.loading);

  useEffect(() => {
    dispatch(loadTopNewsItems());
  }, [dispatch]);

  const router = useRouter();
  const handleMoreNewsClick = () => router.push('/news');

  if (loadingNews) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {/* Header Bar - Made slimmer for mobile */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: { xs: 0.5, md: 3 }, // Minimal margin on mobile
          p: { xs: 0.5, md: 2 }, // Tight padding
          backgroundColor: '#616161', // Standard gray
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NewspaperIcon
            sx={{
              color: 'secondary.main',
              mr: { xs: 1, md: 3 },
              fontSize: { xs: 20, md: 35 }, // Much smaller icon on mobile
            }}
          />
          <Typography
            color="secondary"
            sx={{
              fontSize: { xs: '0.9rem', md: '1.5rem' }, // Scaled down text
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {t('latestNews')}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          onClick={handleMoreNewsClick}
          color="secondary"
          sx={{
            fontSize: { xs: '0.6rem', md: '0.8rem' },
            height: '24px', // Fixed height to keep bar slim
            px: 1,
          }}
        >
          {t('moreNews')}
        </Button>
      </Box>

      {/* Carousel - Strictly constrained height for mobile */}
      <Box
        sx={{
          // This is key: much shorter on mobile to let the map shine
          height: { xs: '120px', sm: '200px', md: '350px' },
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          '& .MuiPaper-root': { boxShadow: 'none' }, // Remove double shadows
        }}
      >
        <Carousel
          navButtonsAlwaysVisible={false} // Hide arrows on mobile to save space
          autoPlay={false}
          indicators={false} // Hide dots on mobile
        >
          {newsItems.map((item, i) => (
            <Box key={i} sx={{ p: 1 }}>
              <NewsItem
                isEditor={false}
                item={item}
                // Ensure NewsItem itself handles small text
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default NewsBox;
