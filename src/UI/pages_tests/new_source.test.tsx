import '@testing-library/jest-dom';
import NewSource from '../pages/new_source';
import { render } from '../test_config/render';
import { screen } from '@testing-library/react';

jest.mock(
  '../components/shared/AuthWrapper',
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
jest.mock(
  '../components/sources/source_form',
  () =>
    function MockSourceForm() {
      return <div data-testid={'source_form'}>form</div>;
    }
);

describe('new source page', () => {
  it('is wrapped in the correct AuthWrapper', () => {
    render(<NewSource />);

    expect(screen.getByTestId('auth=uploader')).toBeInTheDocument();
    expect(screen.getByTestId('source_form')).toBeInTheDocument();
  });
});
