import React from 'react';
import NewsEditorPage from '../../pages/news/edit';
import { render } from '../../test_config/render';
import { screen } from '@testing-library/react';

jest.mock(
  '../../components/shared/AuthWrapper',
  () =>
    function MockAuthWrapper({
      role,
      children,
    }: {
      role: string;
      children: any;
    }) {
      return <div data-testid={`auth=${role}`}>{children}</div>;
    }
);

jest.mock('../../components/news/newsEditor', () => function NewsEditorMock() {
  return (<div>News editor mock</div>)
})

describe('news editor page', () => {
  it('is wrapped in the correct AuthWrapper', () => {
    render(<NewsEditorPage />);

    expect(screen.getByTestId('auth=editor')).toBeInTheDocument();
    expect(screen.getByText('News editor mock')).toBeInTheDocument();
  });
});
