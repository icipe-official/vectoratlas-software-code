import { toast } from 'react-toastify';
import { approveDatasetAuthenticated } from '../../../api/api';
import { approveDataset } from './approveDataset';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../api/api', () => ({
  approveDatasetAuthenticated: jest.fn(),
}));

describe('approveDataset', () => {
  let mockThunkAPI: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };

    mockThunkAPI.getState.mockReturnValue({
      auth: {
        token: 'token12345',
      },
    });
  });
  it('dispatches loading actions and toast success on success', async () => {
    await approveDataset({ datasetId: 'id123' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.success).toHaveBeenCalledWith('Dataset approved.');
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: true,
      type: 'review/setLoading',
    });
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: false,
      type: 'review/setLoading',
    });
  });

  it('dispatches loading actions and toast error on failure', async () => {
    (approveDatasetAuthenticated as jest.Mock).mockRejectedValue({
      errors: 'ERROR',
    });
    await approveDataset({ datasetId: 'id123' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong with dataset approval. Please try again.'
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: true,
      type: 'review/setLoading',
    });
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: false,
      type: 'review/setLoading',
    });
  });
});
