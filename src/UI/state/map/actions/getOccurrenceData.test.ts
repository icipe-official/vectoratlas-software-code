import { startNewSearch, updateOccurrence } from '../mapSlice';
import { getOccurrenceData } from './getOccurrenceData';
import * as api from '../../../api/api';

const mockApi = api as {
  fetchGraphQlData: (query: string) => Promise<any>;
};

const buildFilters = () => ({
  country: { value: [] },
  species: { value: [] },
  isLarval: { value: [] },
  isAdult: { value: [] },
  control: { value: [] },
  season: { value: [] },
  timeRange: {
    value: {
      start: null,
      end: null,
    },
  },
});

jest.mock('../../../api/queries', () => ({
  occurrenceQuery: jest.fn().mockReturnValue('test locations query'),
}));
jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchGraphQlData: jest
    .fn()
    .mockResolvedValue([{ latitude: 1, longitude: 2 }]),
}));

describe('getOccurrenceData', () => {
  let mockThunkAPI: any;
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);

    mockApi.fetchGraphQlData = jest.fn().mockResolvedValueOnce({
      data: {
        OccurrenceData: {
          items: [{ test: 1 }, { test: 2 }],
          total: 2,
          hasMore: false,
        },
      },
    });

    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
  });
  it('dispatches updateOccurrence for one page only', async () => {
    // Setup
    mockApi.fetchGraphQlData = jest.fn().mockResolvedValueOnce({
      data: {
        OccurrenceData: {
          items: [{ test: 1 }, { test: 2 }],
          total: 2,
          hasMore: false,
        },
      },
    });

    const filters = buildFilters();
    await getOccurrenceData(filters)(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      startNewSearch('id1f9add3739635f')
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      updateOccurrence({
        data: [{ test: 1 }, { test: 2 }],
        searchID: 'id1f9add3739635f',
      })
    );
  });

  it('dispatches updateOccurrence multiple times for multiple pages', async () => {
    mockApi.fetchGraphQlData = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          OccurrenceData: {
            items: [{ test: 1 }, { test: 2 }],
            total: 4,
            hasMore: true,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          OccurrenceData: {
            items: [{ test: 3 }, { test: 4 }],
            total: 4,
            hasMore: false,
          },
        },
      });

    const filters = buildFilters();

    await getOccurrenceData(filters)(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      startNewSearch('id1f9add3739635f')
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      updateOccurrence({
        data: [{ test: 1 }, { test: 2 }],
        searchID: 'id1f9add3739635f',
      })
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      updateOccurrence({
        data: [{ test: 1 }, { test: 2 }, { test: 3 }, { test: 4 }],
        searchID: 'id1f9add3739635f',
      })
    );
  });
});
