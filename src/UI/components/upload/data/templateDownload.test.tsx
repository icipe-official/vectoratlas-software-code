import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../test_config/render';
import TemplateDownload from './templateDownload';

describe('TemplateDownload', () => {
  it('calls action on download click with valid inputs', async () => {
    const state = { upload: { templateList: ['Vector Atlas'] } };
    const { store, wrapper } = render(<TemplateDownload />, state);

    fireEvent.mouseDown(wrapper.getByLabelText('Data Type'));
    fireEvent.click(screen.getByText('Bionomics'));

    fireEvent.mouseDown(wrapper.getByLabelText('Data Source'));
    fireEvent.click(screen.getByText('Vector Atlas'));

    fireEvent.click(screen.getByTestId('downloadButton'));

    await waitFor(() => {
      expect(store.getActions()[0].type).toBe(
        'upload/downloadTemplate/pending'
      );
    });
  });
});
