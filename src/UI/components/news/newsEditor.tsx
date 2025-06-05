import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { TextEditor } from '../shared/textEditor/RichTextEditor';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { getNews, upsertNews } from '../../state/news/actions/news.action';
import { News } from '../../state/state.types';
import { toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/Upload';
import CircularProgress from '@mui/material/CircularProgress';
import { toBase64 } from '../shared/imageTools';
import { useTranslations } from 'next-intl';

const UPLOAD_LIMIT_IN_KB = 512;

const NewsEditor = () => {
  const t = useTranslations('NewsPage');

  const [article, setArticle] = useState('');
  const [initialArticle, setInitialArticle] = useState('');
  const [summary, setSummary] = useState('');
  const [initialSummary, setInitialSummary] = useState('');
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();
  const currentNewsItem = useAppSelector((s) => s.news.currentNewsForEditing);
  const loadingNews = useAppSelector((s) => s.news.loading);

  const router = useRouter();
  const id = router.query.id as string | undefined;

  const saveNewsItem = useCallback(() => {
    const news: News = {
      id,
      title: title,
      summary: summary,
      article: article,
      image: image,
    };
    dispatch(upsertNews(news));
  }, [dispatch, id, article, title, summary, image]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // only allow images below 512 KB
    if (e.target.files && e.target.files[0].size < UPLOAD_LIMIT_IN_KB * 1024) {
      const image = await toBase64(e.target.files[0]);
      setImage(image);
    } else {
      toast.error(
        t('newsEditor.errors.exceededFileSize', {
          maxSize: UPLOAD_LIMIT_IN_KB,
        }),
        {
          autoClose: 5000,
        }
      );
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getNews(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentNewsItem) {
      setTitle(currentNewsItem.title);
      setSummary(currentNewsItem.summary);
      setInitialSummary(currentNewsItem.summary);
      setArticle(currentNewsItem.article);
      setInitialArticle(currentNewsItem.article);
      setImage(currentNewsItem.image);
    }
  }, [currentNewsItem]);

  const titleValid = title !== '';
  const summaryValid = summary !== '';

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        {id ? t('newsEditor.edit') : t('newsEditor.create')}
      </Typography>
      {loadingNews ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : null}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('newsEditor.title')}
      </Typography>
      <TextField
        disabled={loadingNews}
        variant="outlined"
        sx={{ width: '100%' }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!titleValid}
        helperText={!titleValid ? t('newsEditor.titleHelperText') : ''}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('newsEditor.summary')}
      </Typography>
      {!loadingNews ? (
        <TextEditor
          error={!summaryValid}
          helperText={!summaryValid ? t('newsEditor.summaryHelperText') : ''}
          description={summary}
          setDescription={setSummary}
          initialDescription={initialSummary}
        />
      ) : (
        <div style={{ height: 250 }} />
      )}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('newsEditor.article')}
      </Typography>
      {!loadingNews ? (
        <TextEditor
          description={article}
          setDescription={setArticle}
          initialDescription={initialArticle}
        />
      ) : (
        <div style={{ height: 250 }} />
      )}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        {t('newsEditor.image')}
      </Typography>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Button
          disabled={loadingNews}
          variant="contained"
          component="label"
          style={{ width: '50%', minWidth: '250px' }}
        >
          <UploadIcon />
          {t('newsEditor.uploadImageFile')}
          <input
            data-testid="image-upload-input"
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        <Typography>
          {t('newsEditor.uploadImageFileHelperText', {
            maxSize: UPLOAD_LIMIT_IN_KB,
          })}
        </Typography>
        {image ? (
          <picture>
            <img style={{ width: '30vw' }} src={image} alt="Article image" />
          </picture>
        ) : null}
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}
      >
        <Button
          variant="contained"
          disabled={loadingNews || !titleValid || !summaryValid}
          onClick={saveNewsItem}
          sx={{ m: 0, minWidth: 150 }}
        >
          {id ? t('newsEditor.buttons.update') : t('newsEditor.buttons.create')}
        </Button>
      </div>
    </div>
  );
};

export default NewsEditor;
