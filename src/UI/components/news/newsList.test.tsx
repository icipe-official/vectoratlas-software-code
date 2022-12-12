import React from 'react';
import { render } from '../../test_config/render';
import NewsList from './newsList';
import { AppState } from '../../state/store';
import { initialState } from '../../state/news/newsSlice';

jest.mock(
  '@mui/material/CircularProgress',
  () =>
    function CircularProgressMock() {
      return <div>Circular progress mock</div>;
    }
);

jest.mock('../news/newsItem', () => ({
  NewsItem: function NewsItemMock(props) {
    return <div> News item mock {JSON.stringify(props)}</div>;
  },
}));

jest.mock('../../state/news/actions/news.action', () => ({
  getAllNewsItems: function getAllNewsItemsMock() {
    return { type: 'getAllNewsItemsMock' };
  },
}));

describe('NewsList component', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    jest.clearAllMocks();

    state = {
      news: initialState(),
    };
  });

  it('shows loading spinning when loading', () => {
    state.news.loading = true;

    const { wrapper } = render(<NewsList />, state);

    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
  });

  it('renders news items correctly', () => {
    state.news.news = [{ title: 'news 1' }, { title: 'news 2' }];

    const { wrapper } = render(<NewsList />, state);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('dispatches getAllNewsItems when first loaded', () => {
    const { store } = render(<NewsList />, state);

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: 'getAllNewsItemsMock' });
  });
});
