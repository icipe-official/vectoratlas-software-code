import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, TextField, Typography, Tabs, Tab, Box } from '@mui/material';
import { TextEditor } from '../shared/textEditor/RichTextEditor';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  getNews,
  upsertNews,
  upsertNewsTranslation,
} from '../../state/news/actions/news.action';
import { News } from '../../state/state.types';
import { toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/Upload';
import CircularProgress from '@mui/material/CircularProgress';
import { toBase64 } from '../shared/imageTools';
import { useTranslations } from 'next-intl';

const UPLOAD_LIMIT_IN_KB = 512;

type LocaleFields = {
  title: string;
  summary: string;
  article: string;
};

const emptyLocale: LocaleFields = { title: '', summary: '', article: '' };

const NewsEditor = () => {
  const t = useTranslations('NewsPage');

  const [activeTab, setActiveTab] = useState(0);

  // English (base) fields — unchanged from before
  const [article, setArticle] = useState('');
  const [initialArticle, setInitialArticle] = useState('');
  const [summary, setSummary] = useState('');
  const [initialSummary, setInitialSummary] = useState('');
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');

  // Translated fields
  const [fr, setFr] = useState<LocaleFields>(emptyLocale);
  const [pt, setPt] = useState<LocaleFields>(emptyLocale);

  const dispatch = useAppDispatch();
  const currentNewsItem = useAppSelector((s) => s.news.currentNewsForEditing);
  const loadingNews = useAppSelector((s) => s.news.loading);

  const router = useRouter();
  const id = router.query.id as string | undefined;

  const saveNewsItem = useCallback(async () => {
    const news: News = {
      id,
      title: title,
      summary: summary,
      article: article,
      image: image,
    };
    await dispatch(upsertNews(news));

    const newsId = id;
    if (!newsId) return; // translations need an existing news id

    if (fr.title || fr.summary || fr.article) {
      await dispatch(
        upsertNewsTranslation({
          newsId,
          locale: 'fr',
          title: fr.title,
          summary: fr.summary,
          article: fr.article,
        })
      );
    }
    if (pt.title || pt.summary || pt.article) {
      await dispatch(
        upsertNewsTranslation({
          newsId,
          locale: 'pt',
          title: pt.title,
          summary: pt.summary,
          article: pt.article,
        })
      );
    }
  }, [dispatch, id, article, title, summary, image, fr, pt]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size < UPLOAD_LIMIT_IN_KB * 1024) {
      const image = await toBase64(e.target.files[0]);
      setImage(image);
    } else {
      toast.error(
        t('newsEditor.errors.exceededFileSize', {
          maxSize: UPLOAD_LIMIT_IN_KB,
        }),
        { autoClose: 5000 }
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

      setFr({
        title: currentNewsItem.title_fr || '',
        summary: currentNewsItem.summary_fr || '',
        article: currentNewsItem.article_fr || '',
      });
      setPt({
        title: currentNewsItem.title_pt || '',
        summary: currentNewsItem.summary_pt || '',
        article: currentNewsItem.article_pt || '',
      });
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

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mt: 2, mb: 2 }}
      >
        <Tab label="English" />
        <Tab label="Français" />
        <Tab label="Português" />
      </Tabs>

      {activeTab === 0 && (
        <>
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
              helperText={
                !summaryValid ? t('newsEditor.summaryHelperText') : ''
              }
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
        </>
      )}

      {activeTab === 1 && (
        <>
          <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
            {t('newsEditor.title')} (Français)
          </Typography>
          <TextField
            variant="outlined"
            sx={{ width: '100%' }}
            value={fr.title}
            onChange={(e) => setFr({ ...fr, title: e.target.value })}
          />
          <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
            {t('newsEditor.summary')} (Français)
          </Typography>
          <TextEditor
            description={fr.summary}
            setDescription={(val: string) => setFr({ ...fr, summary: val })}
            initialDescription={fr.summary}
          />
          <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
            {t('newsEditor.article')} (Français)
          </Typography>
          <TextEditor
            description={fr.article}
            setDescription={(val: string) => setFr({ ...fr, article: val })}
            initialDescription={fr.article}
          />
        </>
      )}

      {activeTab === 2 && (
        <>
          <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
            {t('newsEditor.title')} (Português)
          </Typography>
          <TextField
            variant="outlined"
            sx={{ width: '100%' }}
            value={pt.title}
            onChange={(e) => setPt({ ...pt, title: e.target.value })}
          />
          <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
            {t('newsEditor.summary')} (Português)
          </Typography>
          <TextEditor
            description={pt.summary}
            setDescription={(val: string) => setPt({ ...pt, summary: val })}
            initialDescription={pt.summary}
          />
          <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
            {t('newsEditor.article')} (Português)
          </Typography>
          <TextEditor
            description={pt.article}
            setDescription={(val: string) => setPt({ ...pt, article: val })}
            initialDescription={pt.article}
          />
        </>
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
