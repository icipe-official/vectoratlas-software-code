import { updateSelectedData } from '../mapSlice';
import { getFullOccurrenceData } from './getFullOccurrenceData';
import * as api from '../../../api/api';

const mockApi = api as {
  fetchGraphQlData: (query: string) => Promise<any>;
};

jest.mock('../../../api/queries', () => ({
  fullOccurrenceQuery: jest.fn().mockReturnValue('test locations query'),
}));
jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchGraphQlData: jest
    .fn()
    .mockResolvedValue([{ latitude: 1, longitude: 2 }]),
}));

describe('getFullOccurrenceData', () => {
  let mockThunkAPI: any;
  beforeEach(() => {
    mockApi.fetchGraphQlData = jest.fn().mockResolvedValueOnce({
      data: {
        FullOccurrenceData: [{ test: 1 }, { test: 2 }],
      },
    });

    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue({
        map: {
          selectedIds: ['1'],
        },
      }),
    };
  });

  it('dispatches updateSelectedData', async () => {
    await getFullOccurrenceData()(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      updateSelectedData([{ test: 1 }, { test: 2 }])
    );
  });
});
