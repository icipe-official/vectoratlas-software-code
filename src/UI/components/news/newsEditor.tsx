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

const UPLOAD_LIMIT_IN_KB = 512;

const NewsEditor = () => {
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
      toast.error('Uploaded files must be less than 512 KB.', {
        autoClose: 5000,
      });
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
        {id ? 'Edit' : 'Create'} news item
      </Typography>
      {loadingNews ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : null}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Title
      </Typography>
      <TextField
        disabled={loadingNews}
        variant="outlined"
        sx={{ width: '100%' }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!titleValid}
        helperText={!titleValid ? 'Title cannot be empty' : ''}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Summary
      </Typography>
      {!loadingNews ? (
        <TextEditor
          error={!summaryValid}
          helperText={!summaryValid ? 'Summary cannot be empty' : ''}
          description={summary}
          setDescription={setSummary}
          initialDescription={initialSummary}
        />
      ) : (
        <div style={{ height: 250 }} />
      )}
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Article
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
        Image
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
          Upload Image File
          <input
            data-testid="image-upload-input"
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        <Typography>
          Images must be smaller than {UPLOAD_LIMIT_IN_KB} KB.
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
          {id ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

export default NewsEditor;
