import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../test_config/render';
import ModelUpload from './modelUpload';
import user from '@testing-library/user-event';

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

  it('calls action on upload click', async () => {
    const state = { upload: { modelFile: 'file' } };
    const { store } = render(<ModelUpload />, state);

    fireEvent.click(screen.getByTestId('uploadButton'));

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0].type).toBe('upload/uploadModel/pending');
  });
});
