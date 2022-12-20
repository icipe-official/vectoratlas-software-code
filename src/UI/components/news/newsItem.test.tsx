import React from 'react';
import { fireEvent, render } from '../../test_config/render';
import { NewsItem } from './newsItem';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    push: jest.fn(),
  }),
}));

jest.mock(
  'react-markdown',
  () =>
    function MockReactMarkdown(props: any) {
      return <div>React markdown mock {JSON.stringify(props)}</div>;
    }
);

jest.mock(
  '@mui/icons-material/Edit',
  () =>
    function EditIconMock() {
      return <div>Edit icon mock</div>;
    }
);

describe('NewsItem component', () => {
  let newsItem;

  beforeEach(() => {
    jest.clearAllMocks();

    newsItem = {
      id: '123-456',
      title: 'test news item',
      summary: 'test summary',
      image: 'image-base64-abc-123',
    };

    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: jest.fn(),
    });
  });

  it('renders news item correctly', () => {
    const { wrapper } = render(<NewsItem item={newsItem} />);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('hides more details button if flag is set', () => {
    const { wrapper } = render(
      <NewsItem item={newsItem} hideMoreDetailsButton />
    );

    expect(wrapper.queryByText('More details...')).not.toBeInTheDocument();
  });

  it('directs to article page when more details clicked', () => {
    const { wrapper } = render(<NewsItem item={newsItem} />);
    fireEvent.click(wrapper.getByText('More details...'));

    expect(useRouter().push).toHaveBeenCalledWith('/news/article?id=123-456');
  });

  it('shows editor button if isEditor flag is set', () => {
    const { wrapper } = render(<NewsItem item={newsItem} isEditor />);
    expect(wrapper.getByText('Edit icon mock')).toBeInTheDocument();
  });

  it('does not show editor button if isEditor flag is not set', () => {
    const { wrapper } = render(<NewsItem item={newsItem} />);
    expect(wrapper.queryByText('Edit icon mock')).not.toBeInTheDocument();
  });

  it('directs to edit page when edit button clicked', () => {
    const { wrapper } = render(<NewsItem item={newsItem} isEditor />);
    fireEvent.click(wrapper.getByText('Edit icon mock'));

    expect(useRouter().push).toHaveBeenCalledWith('/news/edit?id=123-456');
  });
});
