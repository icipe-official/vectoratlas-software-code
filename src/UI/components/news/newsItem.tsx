import React, { useState } from 'react';
import { News } from '../../state/state.types';
import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AppDispatch, AppState } from '../../state/store';
import { deleteNews } from '../../state/news/actions/news.action';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '../../state/hooks';

export const NewsItem = ({
  item,
  isEditor,
  hideMoreDetailsButton,
}: {
  item: News;
  isEditor: boolean;
  hideMoreDetailsButton?: boolean;
}) => {
  const t = useTranslations('NewsPage');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const locale = useAppSelector((state: AppState) => state.localization.locale);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // title/title_fr/title_pt (and summary/summary_fr/summary_pt) are separate
  // columns on `item`, not a nested object — so we pick the right column
  // based on locale, falling back to English if a translation is missing.
  const getLocalizedTitle = (): string => {
    if (locale === 'fr' && item.title_fr) return item.title_fr;
    if (locale === 'pt' && item.title_pt) return item.title_pt;
    return item.title;
  };

  const getLocalizedSummary = (): string => {
    if (locale === 'fr' && item.summary_fr) return item.summary_fr;
    if (locale === 'pt' && item.summary_pt) return item.summary_pt;
    return item.summary;
  };

  const handleEditClick = () => router.push('/news/edit?id=' + item.id);
  const handleMoreDetailsClick = () =>
    router.push('/news/article?id=' + item.id);

  const handleDelete = (newsId: string) => {
    setSelectedNewsId(newsId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedNewsId) dispatch(deleteNews(selectedNewsId));
    setOpenDialog(false);
  };

  // Shared button style to ensure consistency and fit
  const buttonStyle = {
    flex: { xs: '1 1 auto', sm: '0 1 auto' },
    minWidth: { xs: '80px', sm: '100px' },
    fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
    px: { xs: 1, sm: 2 },
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    fontWeight: 600,
  };

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 3,
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid #f0f0f0',
        transition: '0.3s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <Grid container>
        {/* Content Section */}
        <Grid
          item
          xs={12}
          md={8}
          lg={9}
          sx={{
            p: { xs: 2, sm: 3 },
            order: { xs: 2, md: 1 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ mb: 2, flexGrow: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: 'primary.dark',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              {getLocalizedTitle()}
            </Typography>

            <Box
              sx={{
                color: 'text.secondary',
                textAlign: { xs: 'left', md: 'justify' },
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <ReactMarkdown>{getLocalizedSummary()}</ReactMarkdown>
            </Box>
          </Box>

          {/* Action Buttons: Smart horizontal layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap', // Allows wrapping if the screen is too narrow for 3 buttons
              gap: { xs: 0.5, sm: 1 },
              mt: 'auto',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              width: '100%',
            }}
          >
            {!hideMoreDetailsButton && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleMoreDetailsClick}
                sx={buttonStyle}
              >
                {t('newsItem.moreDetails')}
              </Button>
            )}
            {isEditor && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleEditClick}
                  sx={buttonStyle}
                >
                  {t('newsItem.editItem')}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    ...buttonStyle,
                    bgcolor: '#d32f2f',
                    '&:hover': { bgcolor: '#b71c1c' },
                  }}
                  onClick={() => handleDelete(item.id as string)}
                >
                  {t('newsItem.deleteItem')}
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={4} lg={3} sx={{ order: { xs: 1, md: 2 } }}>
          <CardMedia
            component="img"
            image={item.image}
            sx={{
              height: { xs: '200px', md: '100%' },
              width: '100%',
              objectFit: 'cover',
            }}
          />
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('newsItem.confirmDeleteTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('newsItem.confirmDeleteMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            {t('newsItem.buttons.cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            {t('newsItem.buttons.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
