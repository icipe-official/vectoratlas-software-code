import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../test_config/render';
import ModelUpload from './modelUpload';
import user from '@testing-library/user-event';

jest.mock(
  '@mui/material/CircularProgress',
  () =>
    function CircularProgressMock() {
      return <div>Circular progress mock</div>;
    }
);

describe('ModelUpload', () => {
  it('calls action on file select of valid file', async () => {
    const { store } = render(<ModelUpload />);

    const file = new File(['hello'], 'hello.tif', { type: 'image/tiff' });
    const input = screen.getByTestId('fileUpload');
    await user.upload(input, file);

    await waitFor(() => {
      expect(store.getActions()).toHaveLength(1);
      expect(store.getActions()[0].type).toBe('upload/setModelFile');
    });
  });

  it('does not call action on file select of invalid file', async () => {
    const { store } = render(<ModelUpload />);

    const file = new File(['hello'], 'hello.txt', { type: 'text/txt' });
    const input = screen.getByTestId('fileUpload');
    await user.upload(input, file);

    expect(store.getActions()).toHaveLength(0);
  });

  it('calls action on upload click with valid inputs', async () => {
    const state = { upload: { modelFile: 'file' } };
    const { store, wrapper } = render(<ModelUpload />, state);
    fireEvent.input(screen.getByRole('textbox', { name: /Display name:/i }), {
      target: { value: 'Title 1' },
    });
    fireEvent.input(
      screen.getByRole('spinbutton', { name: /Maximum value:/i }),
      {
        target: { value: '1' },
      }
    );

    fireEvent.click(screen.getByTestId('uploadButton'));

    await waitFor(() => {
      expect(store.getActions()[0].type).toBe('upload/uploadModel/pending');
    });
  });

  it('starts with validation errors', () => {
    const state = { upload: { modelFile: 'file' } };
    const { wrapper } = render(<ModelUpload />, state);
    expect(
      wrapper.getByText('Display name cannot be empty')
    ).toBeInTheDocument();
    expect(
      wrapper.getByText('Maximum value cannot be empty')
    ).toBeInTheDocument();
    expect(wrapper.getByText('Upload Model').closest('button')).toHaveAttribute(
      'disabled'
    );
  });

  it('displays spinner when loading', () => {
    const state = { upload: { modelFile: 'file', loading: true } };
    const { wrapper } = render(<ModelUpload />, state);
    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
    expect(wrapper.getByText('Upload Model').closest('button')).toHaveAttribute(
      'disabled'
    );
  });
});
