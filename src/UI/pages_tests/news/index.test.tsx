import React from 'react';
import NewsPage from '../../pages/news/index';
import { render } from '../../test_config/render';

jest.mock(
  '../../components/news/newsList',
  () =>
    function NewsListMock() {
      return <div>News list mock</div>;
    }
);

describe('news page', () => {
  it('renders correctly', () => {
    const { wrapper } = render(<NewsPage />);

    expect(wrapper.container).toMatchSnapshot();
  });
});
