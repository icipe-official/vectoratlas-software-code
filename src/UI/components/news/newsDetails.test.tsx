import React from 'react';
import { fireEvent, render } from '../../test_config/render';
import NewsDetails from './newsDetails';
import { AppState } from '../../state/store';
import { initialState } from '../../state/news/newsSlice';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock(
  '@mui/material/CircularProgress',
  () =>
    function CircularProgressMock() {
      return <div>Circular progress mock</div>;
    }
);

jest.mock(
  'react-markdown',
  () =>
    function MockReactMarkdown(props: any) {
      return <div>React markdown mock {JSON.stringify(props)}</div>;
    }
);

jest.mock('../news/newsItem', () => ({
  NewsItem: function NewsItemMock(props) {
    return <div> News item mock {JSON.stringify(props)}</div>;
  },
}));

jest.mock('../../state/news/actions/news.action', () => ({
  getNews: function getNewsMock(id) {
    return { type: 'getNewsMock', payload: id };
  },
}));

describe('NewsDetails component', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    jest.clearAllMocks();

    state = {
      news: initialState(),
    };

    state.news.currentNewsForEditing = {
      id: '123-456',
      title: 'test news item',
      summary: 'test summary',
      image: 'image-base64-abc-123',
      article: 'test article',
    };
  });

  it('shows loading spinning when loading', () => {
    state.news.loading = true;

    const { wrapper } = render(<NewsDetails />, state);

    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
  });

  it('renders the news details correctly', () => {
    const { wrapper } = render(<NewsDetails />, state);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('loads the details when first loading if there is an id', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {
        id: '123-456',
      },
    });
    const { store } = render(<NewsDetails />, state);

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: 'getNewsMock', payload: '123-456' });
  });

  it('shows edit button if editor', () => {
    state.auth = {
      roles: ['editor'],
    };

    const { wrapper } = render(<NewsDetails />, state);

    expect(wrapper.getByText('Edit item')).toBeInTheDocument();
  });
});
