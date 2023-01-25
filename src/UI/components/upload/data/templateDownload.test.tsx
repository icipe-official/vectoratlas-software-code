import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../test_config/render';
import TemplateDownload from './templateDownload';

jest.mock('../../../state/upload/actions/downloadTemplate', () => ({
  downloadTemplate: jest.fn((input) => ({
    type: 'test-downloadTemplate',
    payload: input,
  })),
}));

describe('TemplateDownload', () => {
  it('calls action on download click with valid inputs', async () => {
    const { store, wrapper } = render(<TemplateDownload />);

    fireEvent.mouseDown(wrapper.getByLabelText('Data Type'));
    fireEvent.click(screen.getByText('Bionomics'));

    fireEvent.mouseDown(wrapper.getByLabelText('Data Source'));
    fireEvent.click(screen.getByText('Vector Atlas'));

    fireEvent.click(screen.getByTestId('downloadButton'));

    await waitFor(() => {
      expect(store.getActions()[0].type).toBe('test-downloadTemplate');
    });
  });
});
