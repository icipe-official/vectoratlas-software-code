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

jest.mock('../../../state/upload/actions/uploadData', () => ({
  uploadData: jest.fn((data) => ({
    type: 'test-uploadData',
    payload: data,
  })),
}));

jest.mock('../../../state/upload/actions/downloadTemplate', () => ({
  getTemplateList: jest.fn((data) => ({
    type: 'test-getTemplateList',
    payload: data,
  })),
}));

describe('ModelUpload', () => {
  it('calls action on file select of valid file', async () => {
    const state: Partial<AppState> = {
      upload: {
        ...initialState,
        dataFile: 'file',
        templateList: ['Vector Atlas'],
      },
    };
    const { store, wrapper } = render(<Upform />, state);

    const file = new File(['hello'], 'hello.csv', { type: 'text/csv' });
    const input = screen.getByTestId('fileUpload');
    await user.upload(input, file);

    await waitFor(() => {
      expect(store.getActions()).toHaveLength(2);
      expect(store.getActions()[1].type).toBe('upload/setDataFile');
    });
  });

  it('does not call action on file select of invalid file', async () => {
    const state = { upload: { templateList: ['Vector Atlas'] } };
    const { store, wrapper } = render(<Upform />, state);

    const file = new File(['hello'], 'hello.txt', { type: 'text/txt' });
    const input = screen.getByTestId('fileUpload');
    await user.upload(input, file);

    expect(store.getActions()).not.toContain({
      payload: undefined,
      type: 'upload/uploadData/pending',
    });
  });

  it('calls action on upload click with valid inputs', async () => {
    const state: Partial<AppState> = {
      upload: {
        ...initialState,
        dataFile: 'file',
        templateList: ['Vector Atlas'],
      },
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
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'test-uploadData' }),
        ])
      );
    });
  });

  it('displays spinner when loading', () => {
    const state: Partial<AppState> = {
      upload: {
        ...initialState,
        modelFile: 'file',
        loading: true,
        templateList: ['Vector Atlas'],
      },
    };
    const { wrapper } = render(<Upform />, state);
    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
    expect(wrapper.getByText('Upload Model').closest('button')).toHaveAttribute(
      'disabled'
    );
  });

  it('displays dropdown with all templates', () => {
    const state = {
      upload: { modelFile: 'file', templateList: ['Test 1', 'Test 2'] },
    };
    const { wrapper } = render(<Upform />, state);
    fireEvent.mouseDown(wrapper.getByLabelText('Data Source'));
    expect(wrapper.getByText('Test 1')).toBeInTheDocument();
    expect(wrapper.getByText('Test 2')).toBeInTheDocument();
  });
});
