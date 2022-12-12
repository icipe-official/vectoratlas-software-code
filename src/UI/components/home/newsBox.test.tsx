import React from 'react';
import { act, fireEvent, render, waitFor } from '../../test_config/render';
import NewsBox from './newsBox';
import { AppState } from '../../state/store';
import { initialState } from '../../state/news/newsSlice';
import { useRouter } from 'next/router';

// jest.mock(
//   'react-markdown',
//   () =>
//     function MockReactMarkdown(props: any) {
//       return <div>React markdown mock {JSON.stringify(props)}</div>;
//     }
// );

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    push: jest.fn(),
  }),
}));

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
  loadTopNewsItems: function loadTopNewsItemsMock() {
    return { type: 'loadTopNewsMock' };
  },
}));

describe('NewsBox component', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    jest.clearAllMocks();

    state = {
      news: initialState(),
    };

    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: jest.fn(),
    });
  });

  it('shows loading spinning when loading', () => {
    state.news.loading = true;

    const { wrapper } = render(<NewsBox />, state);

    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
  });

  it('renders news items correctly', () => {
    state.news.topNews = [{ title: 'top news 1' }, { title: 'top news 2' }];

    const { wrapper } = render(<NewsBox />, state);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('dispatches loadTopNewsItems when first loaded', () => {
    const { store } = render(<NewsBox />, state);

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: 'loadTopNewsMock' });
  });

  it('navigates to more news page when more news button clicked', () => {
    const { wrapper } = render(<NewsBox />, state);
    fireEvent.click(wrapper.getByText('More news...'));

    expect(useRouter().push).toHaveBeenCalledWith('/news');
  });
});
