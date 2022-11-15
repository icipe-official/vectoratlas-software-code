import mockStore from '../test_config/mockStore';
import reducer, {
  getSourceInfo,
  initialState,
  changeSourcePage,
  changeSourceRowsPerPage,
  changeSort,
} from './sourceSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';

const mockApi = api as {
  fetchGraphQlData: (query: string) => Promise<any>;
};

jest.mock('../api/queries', () => ({
  referenceQuery: jest.fn().mockReturnValue('test sources query'),
}));

jest.mock('../api/api', () => ({
  __esModule: true,
  fetchGraphQlData: jest.fn().mockResolvedValue({
    data: {
      allReferenceData: [
        {
          author: 'testAuthor',
          article_title: 'testArticleTitle',
          journal_title: 'testJournalTitle',
          citation: 'testCitation',
          year: 0,
          published: true,
          report_type: 'testReportType',
          v_data: true,
        },
      ],
    },
  }),
}));
it('returns initial state when given undefined previous state', () => {
  expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
});

describe('getSourceInfo', () => {
  const pending = { type: getSourceInfo.pending.type };
  const fulfilled = {
    type: getSourceInfo.fulfilled.type,
    payload: {
      items: [
        {
          author: 'testAuthor',
          article_title: 'testArticleTitle',
          journal_title: 'testJournalTitle',
          citation: 'testCitation',
          year: 0,
          published: true,
          report_type: 'testReportType',
          v_data: true,
        },
      ],
      total: 10,
    },
  };
  const rejected = { type: getSourceInfo.rejected.type };
  const { store } = mockStore({ source: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchGraphQL', async () => {
    store.dispatch(getSourceInfo());

    expect(api.fetchGraphQlData).toBeCalled;
  });

  it('returns the fetched data', async () => {
    store.dispatch(getSourceInfo());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    store;
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchGraphQlData = jest
      .fn()
      .mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getSourceInfo());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });

  it('pending action changes state', () => {
    const newState = reducer(initialState, pending);
    expect(newState.source_info).toEqual({ items: [], total: 0 });
    expect(newState.source_info_status).toEqual('loading');
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.source_info).toEqual({
      items: [
        {
          author: 'testAuthor',
          article_title: 'testArticleTitle',
          journal_title: 'testJournalTitle',
          citation: 'testCitation',
          year: 0,
          published: true,
          report_type: 'testReportType',
          v_data: true,
        },
      ],
      total: 10,
    });
    expect(newState.source_info_status).toEqual('success');
  });

  it('rejected action state changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.source_info).toEqual({ items: [], total: 0 });
    expect(newState.source_info_status).toEqual('error');
  });
});

describe('other actions', () => {
  it('changeSourcePage changes the page', () => {
    const action = changeSourcePage(3);
    const newState = reducer(initialState, action);
    expect(newState.source_table_options.page).toEqual(3);
  });

  it('changeSourceRowsPerPage changes the rowsPerPage', () => {
    const action = changeSourceRowsPerPage(100);
    const newState = reducer(initialState, action);
    expect(newState.source_table_options.rowsPerPage).toEqual(100);
  });

  it('changeSort changes the order and orderBy for existing orderBy', () => {
    const action = changeSort('num_id');
    const newState = reducer(initialState, action);
    expect(newState.source_table_options.order).toEqual('desc');
    expect(newState.source_table_options.orderBy).toEqual('num_id');
  });

  it('changeSort changes the order and orderBy for new orderBy', () => {
    const action = changeSort('author');
    const newState = reducer(initialState, action);
    expect(newState.source_table_options.order).toEqual('asc');
    expect(newState.source_table_options.orderBy).toEqual('author');
  });
});
