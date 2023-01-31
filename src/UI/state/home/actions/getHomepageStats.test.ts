import { getHomepageStats } from './getHomepageStats';
import * as api from '../../../api/api';
import { updateStats } from '../homeSlice';

const mockApi = api as {
  fetchGraphQlData: (query: string) => Promise<any>;
};

jest.mock('../../../api/queries', () => ({
  getHomepageAnalytics: jest.fn().mockReturnValue('test analytics'),
}));
jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchGraphQlData: jest.fn().mockResolvedValue({
    data: {
      getHomepageAnalytics: 'test analytics 2',
    },
  }),
}));

describe('getHomepageStats', () => {
  let mockThunkAPI: any;
  beforeEach(() => {
    mockThunkAPI = {
      dispatch: jest.fn(),
    };
  });

  it('dispatches updateStats', async () => {
    await getHomepageStats()(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      updateStats('test analytics 2')
    );
  });
});
