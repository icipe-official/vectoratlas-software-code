import {
  Button,
  Grid,
  Typography,
  Box,
  Container,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getNews } from '../../state/news/actions/news.action';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RolesEnum } from '../../state/state.types';
import { useTranslations } from 'next-intl';
import { AppState } from '../../state/store';

export const NewsDetails = () => {
  const t = useTranslations('NewsPage');
  const dispatch = useAppDispatch();
  const newsItem = useAppSelector((s) => s.news.currentNewsForEditing);
  const loadingNews = useAppSelector((s) => s.news.loading);
  const isEditor = useAppSelector((state) =>
    state.auth.roles.includes(RolesEnum.EDITOR)
  );
  const locale = useAppSelector((state: AppState) => state.localization.locale);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(getNews(id as string));
    }
  }, [id, dispatch]);

  // Helper getters for locale fallback

  // Helper getters for locale fallback
  const getLocalizedTitle = () => {
    if (locale === 'fr' && newsItem?.title_fr) return newsItem.title_fr;
    if (locale === 'pt' && newsItem?.title_pt) return newsItem.title_pt;
    return newsItem?.title || '';
  };

  const getLocalizedSummary = () => {
    if (locale === 'fr' && newsItem?.summary_fr) return newsItem.summary_fr;
    if (locale === 'pt' && newsItem?.summary_pt) return newsItem.summary_pt;
    return newsItem?.summary || '';
  };

  const getLocalizedArticle = () => {
    if (locale === 'fr' && newsItem?.article_fr) return newsItem.article_fr;
    if (locale === 'pt' && newsItem?.article_pt) return newsItem.article_pt;
    return newsItem?.article || '';
  };

  if (loadingNews || !newsItem) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/news')}
          sx={{ textTransform: 'none' }}
        >
          <Typography fontSize={'medium'}>
            {t('newsDetails.backToNewsList')}
          </Typography>
        </Button>
      </Box>

      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.2 }}
        >
          {getLocalizedTitle()}
        </Typography>
        {isEditor && (
          <Button
            variant="contained"
            sx={{ whiteSpace: 'nowrap', px: 4 }}
            onClick={() => router.push('/news/edit?id=' + newsItem.id)}
          >
            {t('newsDetails.editItem')}
          </Button>
        )}
      </Box>

      <Grid container spacing={5}>
        {/* Summary Content */}
        <Grid item xs={12} lg={7}>
          <Box sx={{ color: 'text.primary' }}>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a style={{ color: '#1976d2', fontWeight: 600 }} {...props} />
                ),
                p: ({ node, ...props }) => (
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      textAlign: { xs: 'left', md: 'justify' },
                    }}
                    {...props}
                  />
                ),
              }}
            >
              {getLocalizedSummary()}
            </ReactMarkdown>
          </Box>
        </Grid>

        {/* Hero Image */}
        <Grid item xs={12} lg={5}>
          <Box
            component="img"
            src={newsItem.image}
            alt={t('newsDetails.imageAltText')}
            sx={{
              width: '100%',
              borderRadius: 3,
              boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
              objectFit: 'cover',
              maxHeight: { xs: '350px', lg: '500px' },
            }}
          />
        </Grid>
      </Grid>

      {/* Main Article Content */}
      <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e0e0e0' }}>
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a style={{ color: '#1976d2' }} {...props} />
            ),
            p: ({ node, ...props }) => (
              <Typography
                variant="body1"
                sx={{ mb: 2, lineHeight: 1.7 }}
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <Typography
                variant="h4"
                sx={{ mt: 4, mb: 2, fontWeight: 700 }}
                {...props}
              />
            ),
          }}
        >
          {getLocalizedArticle()}
        </ReactMarkdown>
      </Box>
    </Container>
  );
};

export default NewsDetails;
