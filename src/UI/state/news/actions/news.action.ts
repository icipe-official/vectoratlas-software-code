import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
} from '../../../api/api';
import {
  newsById,
  upsertNewsMutation,
  getAllNews,
  getAllNewsIds,
} from '../../../api/queries';
import { News } from '../../state.types';
import { AppState } from '../../store';
import {
  setCurrentNewsForEditing,
  newsLoading,
  setNewsItems,
  setTopNewsItems,
} from '../newsSlice';
import { toast } from 'react-toastify';

const sanitiseNews = (news: News): News => {
  return {
    ...news,
    title: encodeURIComponent(news.title),
    summary: encodeURIComponent(news.summary),
    article: encodeURIComponent(news.article),
  };
};

const unsanitiseNews = (news: News): News => {
  return {
    ...news,
    title: decodeURIComponent(news.title),
    summary: decodeURIComponent(news.summary),
    article: decodeURIComponent(news.article),
  };
};

export const upsertNews = createAsyncThunk(
  'news/upsert',
  async (news: News, { getState, dispatch }) => {
    dispatch(newsLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const newNews = await fetchGraphQlDataAuthenticated(
        upsertNewsMutation(sanitiseNews(news)),
        token
      );
      if (news.id) {
        toast.success('Updated news with id ' + newNews.data.createEditNews.id);
      } else {
        toast.success('Created news with id ' + newNews.data.createEditNews.id);
      }
      dispatch(
        setCurrentNewsForEditing({
          title: '',
          summary: '',
          article: '',
          image: '',
        })
      );
    } catch (e) {
      console.error(e);
      toast.error('Unable to update news item');
    }
    dispatch(newsLoading(false));
  }
);

export const getNews = createAsyncThunk(
  'news/getWithId',
  async (id: string, { dispatch }) => {
    dispatch(newsLoading(true));
    let res = await fetchGraphQlData(newsById(id));

    dispatch(setCurrentNewsForEditing(unsanitiseNews(res.data.newsById)));
    dispatch(newsLoading(false));
  }
);

export const getAllNewsItems = createAsyncThunk(
  'news/getAll',
  async (_, { dispatch }) => {
    dispatch(newsLoading(true));
    try {
      let res = await fetchGraphQlData(getAllNews());

      dispatch(setNewsItems(res.data.allNews.map(unsanitiseNews)));
    } catch (e) {
      console.error(e);
    }

    dispatch(newsLoading(false));
  }
);

export const loadTopNewsItems = createAsyncThunk(
  'news/getTopNews',
  async (_, { dispatch }) => {
    dispatch(newsLoading(true));
    try {
      let res = await fetchGraphQlData(getAllNewsIds());
      const topNewsIds = res.data.allNews.map((n: News) => n.id).slice(0, 3);

      const topArticles = await Promise.all(
        topNewsIds.map((id: string) => fetchGraphQlData(newsById(id)))
      );

      dispatch(
        setTopNewsItems(
          topArticles.map((res) => unsanitiseNews(res.data.newsById))
        )
      );
    } catch (e) {
      console.error(e);
    }

    dispatch(newsLoading(false));
  }
);
