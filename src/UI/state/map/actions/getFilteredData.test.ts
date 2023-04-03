import { getFilteredData } from '../../../state/map/actions/getFilteredData';
import * as api from '../../../api/api';
import { initialState, MapState } from '../mapSlice';
import { convertToCSV } from '../../../utils/utils';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

const mockApi = api as {
  fetchGraphQlData: (query: string) => Promise<any>;
};

jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchGraphQlData: jest
    .fn()
    .mockResolvedValue({ testAllData: 'mock all data' }),
}));

const testFilters = {
  control: {
    value: [true],
  },
  country: {
    value: ['testCountry'],
  },
  isAdult: {
    value: [false],
  },
  isLarval: {
    value: [true],
  },
  season: {
    value: ['testSeason'],
  },
  species: {
    value: ['testSpecies'],
  },
  timeRange: {
    value: {
      start: 1234,
      end: 4567,
    },
  },
};

jest.mock('../../../api/queries', () => ({
  occurrenceCsvFilterQuery: jest
    .fn()
    .mockReturnValue('occurrence filter query called'),
}));
jest.mock('../../../utils/utils', () => ({
  convertToCSV: jest.fn(),
}));

describe('getFilteredData', () => {
  let state: MapState;

  beforeEach(() => {
    jest.clearAllMocks();
    state = initialState();
    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
  });

  let mockThunkAPI: any;
  describe('when hasMore = false, convertToCsv is called with this single page of data', () => {
    beforeEach(() => {
      mockApi.fetchGraphQlData = jest.fn().mockResolvedValueOnce({
        data: {
          OccurrenceCsvData: {
            items: [
              'testId,month_start,year_start',
              'mock_id_1, 1, 1991',
              'mock_id_2, 2, 1992',
            ],
            total: 2,
            hasMore: false,
          },
        },
      });
    });
    it('dispatches the correct action when button is clicked and handles as expected', async () => {
      await getFilteredData(testFilters)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );
      expect(mockApi.fetchGraphQlData).toBeCalledWith(
        'occurrence filter query called'
      );
      expect(convertToCSV).toBeCalledWith('testId,month_start,year_start', [
        'mock_id_1, 1, 1991',
        'mock_id_2, 2, 1992',
      ]);
    });
  });
  describe('when hasMore = true, convertToCsv is called with two pages of data as a single input', () => {
    beforeEach(async () => {
      mockApi.fetchGraphQlData = jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            OccurrenceCsvData: {
              items: [
                'testId,month_start,year_start',
                'mock_id_1, 1, 1991',
                'mock_id_2, 2, 1992',
              ],
              total: 4,
              hasMore: true,
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            OccurrenceCsvData: {
              items: [
                'testId,month_start,year_start',
                'mock_id_3, 3, 1993',
                'mock_id_4, 4, 1994',
              ],
              total: 4,
              hasMore: false,
            },
          },
        });
    });
    it('calls on the API twice and builds csv input accordingly', async () => {
      await getFilteredData(testFilters)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );
      expect(convertToCSV).toBeCalledWith('testId,month_start,year_start', [
        'mock_id_1, 1, 1991',
        'mock_id_2, 2, 1992',
        'mock_id_3, 3, 1993',
        'mock_id_4, 4, 1994',
      ]);
    });
  });
  describe('Calls on toast to render the appropriate notifications', () => {
    beforeEach(async () => {
      mockApi.fetchGraphQlData = jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            OccurrenceCsvData: {
              items: ['testId,month_start,year_start', 'mock id_1, 1, 1991'],
              total: 4,
              hasMore: true,
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            OccurrenceCsvData: {
              items: ['mock id_2, 2, 1992, mock id_3, 3, 1993'],
              total: 4,
              hasMore: false,
            },
          },
        });
      await getFilteredData(testFilters)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );
    });
    it('calls toast loading and update on succesful download', async () => {
      expect(toast.loading).toHaveBeenCalled();
      expect(toast.update).toHaveBeenCalled();
    });
    describe('Testing of error catch in getFilteredData using null value on second resolve', () => {
      beforeEach(async () => {
        mockApi.fetchGraphQlData = jest
          .fn()
          .mockResolvedValueOnce({
            data: {
              OccurrenceCsvData: {
                items: ['testId,month_start,year_start', 'mock id_1, 1, 1991'],
                total: 4,
                hasMore: true,
              },
            },
          })
          .mockResolvedValueOnce(null);
        await getFilteredData(testFilters)(
          mockThunkAPI.dispatch,
          mockThunkAPI.getState,
          null
        );
      });
      it('calls toast loading and update, with an error flag, on unsucesful download', async () => {
        expect(toast.loading).toHaveBeenCalled();
        expect(toast.update).toHaveBeenCalledWith(undefined, {
          autoClose: 2000,
          closeOnClick: true,
          isLoading: false,
          render:
            "Download Failed: Cannot read properties of null (reading 'data') - For more details refer to the console. If this error persists, please contact vectoratlas@icipe.org",
          type: 'error',
        });
      });
    });
  });
});
