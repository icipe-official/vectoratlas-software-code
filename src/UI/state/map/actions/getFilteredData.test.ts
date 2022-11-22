import { getFilteredData } from '../../../state/map/actions/getFilteredData';
import * as api from '../../../api/api';
import { initialState, MapState } from '../mapSlice';
import { convertToCSV } from '../../../utils/utils';

const mockApi = api as {
  fetchGraphQlData: (query: string) => Promise<any>;
};

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
    state = initialState();
    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
  });

  let mockThunkAPI: any;
  describe('hasMore = false', () => {
    beforeEach(() => {
      mockApi.fetchGraphQlData = jest.fn().mockResolvedValueOnce({
        data: {
          OccurrenceCsvData: {
            items: [
              '{"testId":"mock id_1","month_start":1,"year_start":1991}',
              '{"testId":"mock id_2","month_start":2,"year_start":1992}',
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
      expect(convertToCSV).toBeCalledWith(
        '{"testId":"mock id_1","month_start":1,"year_start":1991}',
        ['{"testId":"mock id_2","month_start":2,"year_start":1992}']
      );
    });
  });
  describe('hasMore = true', () => {
    beforeEach(async () => {
      mockApi.fetchGraphQlData = jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            OccurrenceCsvData: {
              items: [
                '{"testId":"mock id_1","month_start":1,"year_start":1991}',
                '{"testId":"mock id_2","month_start":2,"year_start":1992}',
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
                '{"testId":"mock id_3","month_start":3,"year_start":1993}',
                '{"testId":"mock id_4","month_start":4,"year_start":1994}',
              ],
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
    it('calls on the API twice and builds csv input accordingly', async () => {
      expect(convertToCSV).toBeCalledWith(
        '{"testId":"mock id_1","month_start":1,"year_start":1991}',
        [
          '{"testId":"mock id_2","month_start":2,"year_start":1992}',
          '{"testId":"mock id_4","month_start":4,"year_start":1994}',
        ]
      );
    });
  });
});
