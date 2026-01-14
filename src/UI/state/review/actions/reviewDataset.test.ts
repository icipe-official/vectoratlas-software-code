import { toast } from 'react-toastify';
import { reviewDatasetAuthenticated } from '../../../api/api';
import { reviewDataset } from './reviewDataset';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../api/api', () => ({
  reviewDatasetAuthenticated: jest.fn(),
}));

describe('reviewDataset', () => {
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
    await reviewDataset({ datasetId: 'id123', reviewComments: 'comments' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.success).toHaveBeenCalledWith('Comments sent');
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
    (reviewDatasetAuthenticated as jest.Mock).mockRejectedValue({
      errors: 'ERROR',
    });
    await reviewDataset({ datasetId: 'id123', reviewComments: 'comments' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong with dataset review. Please try again.'
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
