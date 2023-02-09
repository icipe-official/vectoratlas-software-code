import { toast } from 'react-toastify';
import {
  postDataFileAuthenticated,
  postDataFileValidated,
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
  postDataFileValidated: jest.fn(),
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
    (postDataFileValidated as jest.Mock).mockResolvedValue([]);
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
    (postDataFileValidated as jest.Mock).mockResolvedValue([]);
    (postDataFileAuthenticated as jest.Mock).mockResolvedValue({});
    await uploadData({ dataType: 'bionomics' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.success).toHaveBeenCalledWith(
      'Data uploaded! Your data will be sent for review and you will hear back from us soon...'
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

  it('dispatches loading and validation actions with error if validation fails', async () => {
    (postDataFileValidated as jest.Mock).mockResolvedValue([
      { error: 1 },
      { error: 2 },
    ]);
    await uploadData({ dataType: 'bionomics' })(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Validation error(s) found with uploaded data - Please check the validation console'
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: false,
      type: 'upload/uploadLoading',
    });
    expect(postDataFileAuthenticated).not.toBeCalled();
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith({
      payload: [{ error: 1 }, { error: 2 }],
      type: 'upload/updateValidationErrors',
    });
  });
});
