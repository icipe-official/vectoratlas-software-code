import FileSaver from 'file-saver';
import { toast } from 'react-toastify';
import * as api from '../../../api/api';
import { downloadDatasetData } from './downloadData';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../../api/api', () => ({
  getDatasetData: jest.fn(),
}));

jest.mock('file-saver');

jest.mock('../reviewSlice', () => ({
  setDownloading: jest.fn(),
}));

describe('downloadDatasetData', () => {
  let mockThunkAPI: any;

  beforeEach(() => {
    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
  });

  it('toast error on failure', async () => {
    (api.getDatasetData as jest.Mock).mockRejectedValue({
      errors: 'ERROR',
    });
    await downloadDatasetData({ datasetId: 'id123' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong with data download. Please try again.'
    );
  });

  it('file download on success', async () => {
    (api.getDatasetData as jest.Mock).mockResolvedValue({
      data: 'DATA',
    });
    await downloadDatasetData({ datasetId: 'id123' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(FileSaver.saveAs).toHaveBeenCalledWith(
      expect.anything(),
      'data-id123.csv'
    );
  });
});
