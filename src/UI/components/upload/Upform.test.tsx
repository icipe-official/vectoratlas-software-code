import {
  fireEvent,
  getByLabelText,
  render,
  screen,
  waitFor,
  within,
} from '../../test_config/render';
import Upform from './Upform';
import user from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';

jest.mock(
  '@mui/material/CircularProgress',
  () =>
    function CircularProgressMock() {
      return <div>Circular progress mock</div>;
    }
);

describe('ModelUpload', () => {
  it('calls action on file select of valid file', async () => {
    const { store } = render(<Upform />);

    const file = new File(['hello'], 'hello.csv', { type: 'text/csv' });
    const input = screen.getByTestId('fileUpload');
    await user.upload(input, file);

    await waitFor(() => {
      expect(store.getActions()).toHaveLength(1);
      expect(store.getActions()[0].type).toBe('upload/setDataFile');
    });
  });

  it('does not call action on file select of invalid file', async () => {
    const { store } = render(<Upform />);

    const file = new File(['hello'], 'hello.txt', { type: 'text/txt' });
    const input = screen.getByTestId('fileUpload');
    await user.upload(input, file);

    expect(store.getActions()).toHaveLength(0);
  });

  it('calls action on upload click with valid inputs', async () => {
    const state = { upload: { dataFile: 'file' } };
    const { store, wrapper } = render(<Upform />, state);
    fireEvent.mouseDown(wrapper.getByLabelText("Data Type"));

    fireEvent.click(screen.getByText('Bionomics'));

    const file = new File(['hello'], 'hello.csv', { type: 'text/csv' });
    const input = screen.getByTestId('fileUpload');
    await user.upload(input, file);

    fireEvent.click(screen.getByTestId('uploadButton'));

    await waitFor(() => {
      expect(store.getActions()[1].type).toBe('upload/uploadData/pending');
    });
  });


  it('displays spinner when loading', () => {
    const state = { upload: { modelFile: 'file', loading: true } };
    const { wrapper } = render(<Upform />, state);
    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
    expect(wrapper.getByText('Upload Model').closest('button')).toHaveAttribute(
      'disabled'
    );
  });
});
