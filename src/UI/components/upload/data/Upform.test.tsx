import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../test_config/render';
import Upform from './Upform';
import user from '@testing-library/user-event';
import { initialState } from '../../../state/upload/uploadSlice';
import { AppState } from '../../../state/store';

jest.mock(
  '@mui/material/CircularProgress',
  () =>
    function CircularProgressMock() {
      return <div>Circular progress mock</div>;
    }
);

jest.mock(
  './templateDownload',
  () =>
    function TemplateDownloadMock() {
      return <div>TemplateDownloadMock</div>;
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
    const state: Partial<AppState> = {
      upload: { ...initialState, dataFile: 'file' },
    };
    const { store, wrapper } = render(<Upform />, state);

    fireEvent.mouseDown(wrapper.getByLabelText('Data Type'));
    fireEvent.click(screen.getByText('Bionomics'));

    fireEvent.mouseDown(wrapper.getByLabelText('Data Source'));
    fireEvent.click(screen.getByText('Vector Atlas'));

    const file = new File(['hello'], 'hello.csv', { type: 'text/csv' });
    const input = screen.getByTestId('fileUpload');
    await user.upload(input, file);

    fireEvent.click(screen.getByTestId('uploadButton'));

    await waitFor(() => {
      expect(store.getActions()[1].type).toBe('upload/uploadData/pending');
    });
  });

  it('displays spinner when loading', () => {
    const state: Partial<AppState> = {
      upload: { ...initialState, modelFile: 'file', loading: true },
    };
    const { wrapper } = render(<Upform />, state);
    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
    expect(wrapper.getByText('Upload Model').closest('button')).toHaveAttribute(
      'disabled'
    );
  });
});
