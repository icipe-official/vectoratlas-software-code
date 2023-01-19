import { toast } from 'react-toastify';
import {
  postDataFileAuthenticated,
} from '../../../api/api';
import { uploadData } from './uploadData';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../api/api', () => ({
  postDataFileAuthenticated: jest.fn(),
}));

describe('uploadData', () => {
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
      upload: { dataFile: 'file' },
    });
  });

  it('toast errors on missing file', async () => {
    mockThunkAPI.getState.mockReturnValue({
      auth: {
        token: 'token12345',
      },
      upload: {},
    });
    await uploadData({ dataType: 'bionomics' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(toast.error).toHaveBeenCalledWith(
      'No file uploaded. Please choose a file and try again.'
    );
  });

  it('dispatches loading actions and toast error if upload fails', async () => {
    (postDataFileAuthenticated as jest.Mock).mockResolvedValue({
      errors: 'ERROR',
    });
    await uploadData({ dataType: 'bionomics' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Unknown error in uploading data. Please try again.'
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: true,
      type: 'upload/uploadLoading',
    });
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: false,
      type: 'upload/uploadLoading',
    });
  });

  it('dispatches loading actions and toast success if upload succeeds', async () => {
    (postDataFileAuthenticated as jest.Mock).mockResolvedValue({});
    await uploadData({ dataType: 'bionomics' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.success).toHaveBeenCalledWith(
      'Data uploaded.'
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: true,
      type: 'upload/uploadLoading',
    });
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: false,
      type: 'upload/uploadLoading',
    });
  });
});
