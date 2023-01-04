import {
  setCurrentNewsForEditing,
  newsLoading,
  setNewsItems,
  setTopNewsItems,
} from '../newsSlice';
import {
  getNews,
  getAllNewsItems,
  upsertNews,
  loadTopNewsItems,
} from './news.action';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
} from '../../../api/api';
import { toast } from 'react-toastify';
import { News } from '../../state.types';
import { upsertNewsMutation } from '../../../api/queries';
import * as logger from '../../../utils/logger';

jest.mock('../../../api/api', () => ({
  fetchGraphQlDataAuthenticated: jest.fn(),
  fetchGraphQlData: jest.fn(),
}));

jest.mock('../../../utils/logger', () => ({
  error: jest.fn(),
}));

jest.mock('../../../api/queries', () => ({
  newsById: jest.fn((id) => 'newsById: ' + id),
  upsertNewsMutation: jest
    .fn()
    .mockImplementation((info) => 'upsertNewsMutation: ' + info.id),
  getAllNews: jest.fn(),
  getAllNewsIds: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('news actions', () => {
  let mockThunkAPI: any;

  beforeEach(() => {
    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };

    mockThunkAPI.getState.mockReturnValue({
      auth: {
        token: 'token12345',
      },
    });
  });

  describe('getNews', () => {
    it('dispatches setCurrentNewsForEditing with the result from the API', async () => {
      const expectedNews = {
        title: 'test title',
        summary: 'summary test',
        article: 'article test',
      };

      (fetchGraphQlData as jest.Mock).mockResolvedValue({
        data: {
          newsById: expectedNews,
        },
      });

      await getNews('123-456')(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(fetchGraphQlData).toHaveBeenCalledWith('newsById: 123-456');
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(newsLoading(true));
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        setCurrentNewsForEditing(expectedNews)
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(newsLoading(false));
    });

    it('desanitises input for display', async () => {
      (fetchGraphQlData as jest.Mock).mockResolvedValue({
        data: {
          newsById: {
            article: 'description%20%C3%B2',
            id: '123-456',
            title: 'Test%20with%20special%20character%20%C3%A0',
            summary: 'Short%20description%20%C3%A8',
          },
        },
      });

      await getNews('123-456')(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        setCurrentNewsForEditing({
          id: '123-456',
          title: 'Test with special character à',
          summary: 'Short description è',
          article: 'description ò',
        })
      );
    });
  });

  describe('upsertNews', () => {
    let news: News;

    beforeEach(() => {
      jest.clearAllMocks();

      news = {
        id: 'save-test-123',
        title: 'save test',
        summary: 'short description',
        article: 'description',
      };

      (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
        data: {
          createEditNews: news,
        },
      });
    });

    it('calls the API to save information correctly when updating and resets', async () => {
      await upsertNews(news)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(fetchGraphQlDataAuthenticated).toHaveBeenCalledWith(
        'upsertNewsMutation: save-test-123',
        'token12345'
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Updated news with id save-test-123'
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        setCurrentNewsForEditing({
          title: '',
          summary: '',
          article: '',
          image: '',
        })
      );
    });

    it('calls the API to save information correctly when creating and resets', async () => {
      delete news.id;

      (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
        data: {
          createEditNews: {
            ...news,
            id: 'created-new-id',
          },
        },
      });

      await upsertNews(news)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(toast.success).toHaveBeenCalledWith(
        'Created news with id created-new-id'
      );
    });

    it('santises input before sending to the API', async () => {
      news.title = 'Test with special character à';
      news.summary = 'Short description è';
      news.article = 'description ò';

      await upsertNews(news)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(upsertNewsMutation).toHaveBeenCalledWith({
        article: 'description%20%C3%B2',
        id: 'save-test-123',
        title: 'Test%20with%20special%20character%20%C3%A0',
        summary: 'Short%20description%20%C3%A8',
      });
    });

    it('shows an error and logs if upserting fails', async () => {
      (fetchGraphQlDataAuthenticated as jest.Mock).mockRejectedValue(
        new Error('test upsert fail')
      );

      await upsertNews(news)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(toast.error).toHaveBeenCalledWith('Unable to update news item');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getAllNewsItems', () => {
    it('dispatches setNewsItems with desanitised news items', async () => {
      (fetchGraphQlData as jest.Mock).mockResolvedValue({
        data: {
          allNews: [
            {
              article: 'description%20%C3%B2',
              id: '123-456',
              title: 'Test%20with%20special%20character%20%C3%A0',
              summary: 'Short%20description%20%C3%A8',
            },
          ],
        },
      });

      await getAllNewsItems()(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        setNewsItems([
          {
            id: '123-456',
            title: 'Test with special character à',
            summary: 'Short description è',
            article: 'description ò',
          },
        ])
      );
    });
  });

  describe('loadTopNewsItems', () => {
    const buildNewsItem = (id) => ({
      data: {
        newsById: {
          article: 'description%20%C3%B2',
          id,
          title: 'Test%20with%20special%20character%20%C3%A0',
          summary: 'Short%20description%20%C3%A8',
        },
      },
    });

    it('loads to top 3 ids and then retrieves the details', async () => {
      (fetchGraphQlData as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            allNews: [
              { id: '1' },
              { id: '2' },
              { id: '3' },
              { id: '4' },
              { id: '5' },
            ],
          },
        })
        .mockResolvedValueOnce(buildNewsItem('1'))
        .mockResolvedValueOnce(buildNewsItem('2'))
        .mockResolvedValueOnce(buildNewsItem('3'))
        .mockResolvedValueOnce(buildNewsItem('4'));

      await loadTopNewsItems()(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        setTopNewsItems([
          {
            id: '1',
            title: 'Test with special character à',
            summary: 'Short description è',
            article: 'description ò',
          },
          {
            id: '2',
            title: 'Test with special character à',
            summary: 'Short description è',
            article: 'description ò',
          },
          {
            id: '3',
            title: 'Test with special character à',
            summary: 'Short description è',
            article: 'description ò',
          },
        ])
      );
    });
  });
});
