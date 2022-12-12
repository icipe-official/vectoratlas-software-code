import React from 'react';
import NewsArticlePage from '../../pages/news/article';
import { render } from '../../test_config/render';

jest.mock(
  '../../components/news/newsDetails',
  () =>
    function NewsDetailsMock() {
      return <div>News details mock</div>;
    }
);

describe('news details page', () => {
  it('renders correctly', () => {
    const { wrapper } = render(<NewsArticlePage />);

    expect(wrapper.container).toMatchSnapshot();
  });
});
