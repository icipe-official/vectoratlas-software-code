import '@testing-library/jest-dom';
import { render } from '../test_config/render';
import { screen } from '@testing-library/react';
import Upload from '../pages/upload';

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
  '../components/upload/data/Upform',
  () =>
    function MockUploadForm() {
      return <div data-testid={'upload_form'}>form</div>;
    }
);

describe('upload page', () => {
  it('is wrapped in the correct AuthWrapper', () => {
    render(<Upload />);

    expect(screen.getByTestId('auth=uploader')).toBeInTheDocument();
    expect(screen.getByTestId('upload_form')).toBeInTheDocument();
  });
});
