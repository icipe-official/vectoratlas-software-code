import { toast } from 'react-toastify';
import {
  fetchGraphQlDataAuthenticated,
  postModelFileAuthenticated,
} from '../../../api/api';
import { uploadModel } from './uploadModel';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../api/api', () => ({
  fetchGraphQlDataAuthenticated: jest.fn(),
  postModelFileAuthenticated: jest.fn(),
}));

describe('uploadModel', () => {
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
      upload: { modelFile: 'file' },
    });
  });

  it('toast errors on missing file', async () => {
    mockThunkAPI.getState.mockReturnValue({
      auth: {
        token: 'token12345',
      },
      upload: {},
    });
    await uploadModel({ displayName: 'display', maxValue: '1' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(toast.error).toHaveBeenCalledWith(
      'No file uploaded. Please choose a file and try again.'
    );
  });

  it('dispatches loading actions and toast error if upload fails', async () => {
    (postModelFileAuthenticated as jest.Mock).mockResolvedValue({
      errors: 'ERROR',
    });
    await uploadModel({ displayName: 'display', maxValue: '1' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Unknown error in uploading model. Please try again.'
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
    (postModelFileAuthenticated as jest.Mock).mockResolvedValue({});
    await uploadModel({ displayName: 'display', maxValue: '1' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.success).toHaveBeenCalledWith(
      'Model uploaded, now transforming...'
    );
  });

  it('dispatches loading actions and toast error if transform fails', async () => {
    (postModelFileAuthenticated as jest.Mock).mockResolvedValue({});
    (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
      data: { postProcessModel: { status: 'ERROR' } },
    });
    await uploadModel({ displayName: 'display', maxValue: '1' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Unknown error in transforming model. Please try again.'
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

  it('dispatches loading actions and toast success if transform succeeds', async () => {
    (postModelFileAuthenticated as jest.Mock).mockResolvedValue({});
    (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
      data: { postProcessModel: { status: 'DONE' } },
    });
    await uploadModel({ displayName: 'display', maxValue: '1' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.success).toHaveBeenCalledWith(
      'Model uploaded and transformed.'
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
