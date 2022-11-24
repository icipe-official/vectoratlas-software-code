import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsBox from './newsBox';

jest.mock(
  'react-markdown',
  () =>
    function MockReactMarkdown(props: any) {
      return <div>React markdown mock {JSON.stringify(props)}</div>;
    }
);

describe('NewsBox component', () => {
  it('renders', () => {
    const { container } = render(<NewsBox />);

    expect(container).toHaveTextContent(
      '8th Annual PAMCA conference in Kigali!'
    );
    expect(container).toHaveTextContent(
      'We will be presenting the Vector Atlas at PAMCA!'
    );
    expect(container).toHaveTextContent(
      'We would like to hear from you - please complete our online'
    );
    expect(container).toHaveTextContent(
      'Vector Atlas Launch Meeting – 4th to 8th July 2022'
    );
  });
});
